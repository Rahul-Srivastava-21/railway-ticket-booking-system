// import prisma from '../config/prismaClient.js'; // Prisma client instance

// // Book a new ticket
// const bookTicket = async (req, res) => {
//   const { startStop, endStop, seatNumber } = req.body;
//   const userId = req.user.id; // User from the authenticated token
//   try {
//     // Check if the seat is already booked
//     const existingTicket = await prisma.ticket.findFirst({
//       where: {
//         startStop: startStop,
//         endStop: endStop,
//         seatNumber: seatNumber,
//         bookingStatus: 'booked',
//       },
//     });

//     if (existingTicket) {
//       return res.status(400).json({ error: 'Seat is already booked for this route.' });
//     }

//     // Create a new ticket
//     const newTicket = await prisma.ticket.create({
//       data: {
//         userId,
//         startStop,
//         endStop,
//         seatNumber,
//         bookingStatus: 'booked',
//         paymentStatus: 'pending', // You can later integrate payment
//       },
//     });

//     res.status(201).json({ message: 'Ticket booked successfully!', ticket: newTicket });
//   } catch (err) {
//     res.status(500).json({ error: 'Something went wrong. Please try again.' });
//   }
// };

// // Get details of a specific ticket
// const getTicket = async (req, res) => {
//   const { ticketId } = req.params;

//   try {
//     const ticket = await prisma.ticket.findUnique({
//       where: { id: parseInt(ticketId) },
//       include: { user: true }, // Include user details if needed
//     });

//     if (!ticket) {
//       return res.status(404).json({ error: 'Ticket not found.' });
//     }

//     res.status(200).json({ ticket });
//   } catch (err) {
//     res.status(500).json({ error: 'Something went wrong. Please try again.' });
//   }
// };

// // Get all tickets for the logged-in user
// const getUserTickets = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const tickets = await prisma.ticket.findMany({
//       where: { userId },
//     });

//     res.status(200).json({ tickets });
//   } catch (err) {
//     res.status(500).json({ error: 'Something went wrong. Please try again.' });
//   }
// };

// // Cancel a booked ticket
// const cancelTicket = async (req, res) => {
//   const { ticketId } = req.body;

//   try {
//     // Check if the ticket exists and is booked
//     const ticket = await prisma.ticket.findUnique({
//       where: { id: parseInt(ticketId) },
//     });

//     if (!ticket || ticket.bookingStatus !== 'booked') {
//       return res.status(400).json({ error: 'Ticket is not booked or already canceled.' });
//     }

//     // Cancel the ticket
//     const canceledTicket = await prisma.ticket.update({
//       where: { id: parseInt(ticketId) },
//       data: {
//         bookingStatus: 'available', // Mark seat as available
//       },
//     });

//     res.status(200).json({ message: 'Ticket canceled successfully!', ticket: canceledTicket });
//   } catch (err) {
//     res.status(500).json({ error: 'Something went wrong. Please try again.' });
//   }
// };

// export { bookTicket, getTicket, getUserTickets, cancelTicket };
