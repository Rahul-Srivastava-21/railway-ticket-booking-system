import { log } from "console";
import prisma from "../config/prismaClient.js";
import { sendEmail } from "../controllers/emailService.js";
// import { generatePDFTicket }from '../controllers/ticketController.js'
import axios from "axios";
import fs from "fs";


export const createBooking = async (req, res) => {
  const { trainId, seatId, boardingStop, destinationStop } = req.body;
  const userId = req.user.id;

  try {
    // Fetch available seat and its current bookings
    const seat = await prisma.seat.findUnique({
      where: { id: seatId },
      select: {
        reservedFromStopId: true,
        reservedToStopId: true,
        trainId: true,
      },
    });

    // Ensure seat exists
    if (!seat) {
      return res.status(404).json({ error: "Seat not found." });
    }

    // Check if the seat is available for the requested segment
    const isAvailable =
      !seat.reservedFromStopId || !seat.reservedToStopId ||
      destinationStop <= seat.reservedFromStopId || boardingStop >= seat.reservedToStopId;

    let status = "CONFIRMED";  // Default status
    // If the seat is not available, place the user on the waitlist
    if (!isAvailable) {
      status = "WAITLIST"; // Waitlist status
    }

    // Calculate the new reservation range
    const newReservedFromStopId = seat.reservedFromStopId
      ? Math.min(seat.reservedFromStopId, boardingStop)
      : boardingStop;

    const newReservedToStopId = seat.reservedToStopId
      ? Math.max(seat.reservedToStopId, destinationStop)
      : destinationStop;

    // Create booking with the appropriate status (CONFIRMED or WAITLIST)
    const booking = await prisma.booking.create({
      data: {
        userId,
        trainId: seat.trainId,
        seatId,
        status,
      },
    });

    // Update seat reservation details
    if (status === "CONFIRMED") {
      await prisma.seat.update({
        where: { id: seatId },
        data: {
          reservedFromStopId: newReservedFromStopId,
          reservedToStopId: newReservedToStopId,
        },
      });
    }

    // Respond with booking confirmation
    res.status(201).json({ message: status === "CONFIRMED" ? "Booking confirmed!" : "Added to waitlist.", booking });

    // If the user is on the waitlist, don't continue with the email/PDF generation
    if (status === "WAITLIST") return;

    // Proceed with generating the ticket PDF
    const bid = booking.id;
    const pdfPath = `./src/tickets/ticket_${bid}.pdf`;

    try {
      // Generate PDF by requesting your PDF generation endpoint
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:3000/api/tickets/${bid}/pdf`,
        headers: {
          Authorization: req.headers.authorization,
        },
      };

      const response = await axios.request(config);

      // Check if PDF file exists after download
      if (!fs.existsSync(pdfPath)) {
        throw new Error("PDF file not generated.");
      }

      // Send confirmation email with the ticket PDF attached
      const subject = "Your Ticket Booking Confirmation";
      let user;

      try {
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true },
        });

        if (!user) {
          console.log("User not found.");
          return; // Email will not be sent if user is not found.
        }

        const text = `Hello ${user.name},\n\nYour booking is confirmed. Please find your ticket attached.`;
        const attachments = [
          { filename: `ticket_${booking.id}.pdf`, path: pdfPath },
        ];

        // Send email
        try {
          await sendEmail(user.email, subject, text, attachments);
        } catch (emailError) {
          console.log("Error sending email:", emailError);
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    } catch (error) {
      console.log("Error generating ticket PDF:", error);
    }
  } catch (err) {
    console.error("Internal server error:", err);
    // Only send a response if no response has been sent yet
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error." });
    }
  }
};



// // Cancel a booking
// export const cancelBooking = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the booking with seat information
//     const booking = await prisma.booking.findUnique({
//       where: { id: parseInt(id) },
//       include: { seat: true }, // Include seat information for updating seat status
//     });

//     // Check if the booking exists
//     if (!booking) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking not found." });
//     }

//     // Check if the user owns the booking
//     if (booking.userId !== req.user.id) {
//       return res
//         .status(403)
//         .json({
//           success: false,
//           message: "Unauthorized to cancel this booking.",
//         });
//     }

//     // Check if the booking is already canceled
//     if (booking.status === "CANCELLED") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Booking is already canceled." });
//     }

//     // Update the booking status to CANCELLED
//     await prisma.booking.update({
//       where: { id: parseInt(id) },
//       data: {
//         status: "CANCELLED", // Update status to 'CANCELLED'
//       },
//     });

//     // If the booking has a seat, free up the seat
//     if (booking.seatId) {
//       // Update the seat status to 'AVAILABLE' and clear the reservedFromStopId and reservedToStopId
//       await prisma.seat.update({
//         where: { id: booking.seatId },
//         data: {
//           status: "AVAILABLE",
//           reservedFromStopId: null,
//           reservedToStopId: null,
//         },
//       });

//       // Handle waitlist: Check for any waitlisted booking for this train
//       const waitlistedBooking = await prisma.booking.findFirst({
//         where: {
//           status: "WAITLIST",
//           trainId: booking.trainId,
//         },
//         orderBy: { createdAt: "asc" }, // Assign the earliest waitlisted booking
//       });

//       if (waitlistedBooking) {
//         // Update the waitlisted booking to 'CONFIRMED' and assign the seat
//         await prisma.booking.update({
//           where: { id: waitlistedBooking.id },
//           data: { status: "CONFIRMED", seatId: booking.seatId },
//         });

//         // Update the seat status to 'RESERVED'
//         await prisma.seat.update({
//           where: { id: booking.seatId },
//           data: { status: "RESERVED" },
//         });

//         // Notify the waitlisted user
//         const subject = "Seat Available - Your Waitlisted Booking is Confirmed";
//         const text = `Hello ${waitlistedBooking.user.name},\n\nA seat is now available for your waitlisted booking. Your booking is now confirmed.`;
//         await sendEmail(waitlistedBooking.user.email, subject, text);
//       }
//     }
//     const subject = "Booking Canceled";
//     const uId = booking.userId;
//     let user,train ;
//     try {
//       user = await prisma.user.findUnique({
//         where: {
//           id: uId,
//         },
//         select: {
//           name: true,
//           email: true // Only select the name field
//         },
//       });
//         train = await prisma.train.findUnique({
//           where: {
//             id: booking.trainId,
//           },
//           select: {
//             name: true
//           },
//         });

//       if (user||train) {
//         console.log("User Name:", user.name);
//         console.log("Train Name:", train.name)
//       } else {
//         console.log("User or Train not found");
//       }
//     } catch (error) {
//       console.log("Error fetching user:", error);
//     }
//     const text = `Hello ${user.name},\n\nYour booking for Train ${train.name} has been canceled.`;
//     await sendEmail(user.email, subject, text);
//     res
//       .status(200)
//       .json({ success: true, message: "Booking canceled successfully." });
//   } 
//   catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ success: false, error: "Failed to cancel booking." });
//   }
// };

// Fetch booking history
export const getBookingHistory = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        train: true,
        seat: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bookings found." });
    }

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch booking history." });
  }
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the booking with seat information
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { seat: true }, // Include seat information for updating seat status
    });

    // Check if the booking exists
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    // Check if the user owns the booking
    if (booking.userId !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized to cancel this booking.",
        });
    }

    // Check if the booking is already canceled
    if (booking.status === "CANCELLED") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is already canceled." });
    }

    // Update the booking status to CANCELLED
    await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        status: "CANCELLED", // Update status to 'CANCELLED'
      },
    });

    // If the booking has a seat, free up the seat
    if (booking.seatId) {
      // Update the seat status to 'AVAILABLE' and clear the reservedFromStopId and reservedToStopId
      await prisma.seat.update({
        where: { id: booking.seatId },
        data: {
          status: "AVAILABLE",
          reservedFromStopId: null,
          reservedToStopId: null,
        },
      });

      // Handle waitlist: Check for any waitlisted booking for this train
      const waitlistedBooking = await prisma.booking.findFirst({
        where: {
          status: "WAITLIST",
          trainId: booking.trainId,
        },
        orderBy: { createdAt: "asc" }, // Assign the earliest waitlisted booking
      });

      if (waitlistedBooking) {
        // Update the waitlisted booking to 'CONFIRMED' and assign the seat
        await prisma.booking.update({
          where: { id: waitlistedBooking.id },
          data: { status: "CONFIRMED", seatId: booking.seatId },
        });

        console.log(waitlistedBooking);
        
        // Update the seat status to 'RESERVED'
        await prisma.seat.update({
          where: { id: booking.seatId },
          data: { status: "RESERVED" },
        });

        const wuId = waitlistedBooking.userId;
        let user;
        try {
          // Fetch the user details (name and email) based on the userId
           user = await prisma.user.findUnique({
            where: { id: wuId },
            select: {
              name: true,
              email: true,
            },
          });
        
          if (user) {
            console.log("User Name:", user.name);
            console.log("User Email:", user.email);
          } else {
            console.log("User not found.");
          }
        } catch (error) {
          console.log("Error fetching user details:", error);
        }

  
        const bid = waitlistedBooking.id;
        const pdfPath = `./src/tickets/ticket_${bid}.pdf`;

    try {
      // Generate PDF by requesting your PDF generation endpoint
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:3000/api/tickets/${bid}/pdf`,
        headers: {
          Authorization: req.headers.authorization,
        },
      };

      const response = await axios.request(config);

      // Check if PDF file exists after download
      if (!fs.existsSync(pdfPath)) {
        throw new Error("PDF file not generated.");
      }

      // Send confirmation email with the ticket PDF attached
      const subject = "Seat Available - Your Waitlisted Booking is Confirmed";
      let user;

      try {
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true },
        });

        if (!user) {
          console.log("User not found.");
          return; // Email will not be sent if user is not found.
        }

        const text = `Hello ${user.name},\n\nA seat is now available for your waitlisted booking. Your booking is now confirmed.`;
        const attachments = [
          { filename: `ticket_${booking.id}.pdf`, path: pdfPath },
        ];

        // Send email
        try {
          await sendEmail(user.email, subject, text, attachments);
        } catch (emailError) {
          console.log("Error sending email:", emailError);
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    } catch (error) {
      console.log("Error generating ticket PDF:", error);
    }
      }
    }

    const subject = "Booking Canceled";
    const uId = booking.userId;
    let user, train;
    try {
      user = await prisma.user.findUnique({
        where: {
          id: uId,
        },
        select: {
          name: true,
          email: true // Only select the name field
        },
      });
      train = await prisma.train.findUnique({
        where: {
          id: booking.trainId,
        },
        select: {
          name: true
        },
      });

      if (user && train) {
        console.log("User Name:", user.name);
        console.log("Train Name:", train.name);
      } else {
        console.log("User or Train not found");
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }

    const text = `Hello ${user.name},\n\nYour booking for Train ${train.name} has been canceled.`;
    await sendEmail(user.email, subject, text);
    res
      .status(200)
      .json({ success: true, message: "Booking canceled successfully." });
  } 
  catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to cancel booking." });
  }
};