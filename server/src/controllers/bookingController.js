import prisma from '../config/prismaClient.js';

export const createBooking = async (req, res) => {
    const { trainId, seatId, boardingStop, destinationStop } = req.body;
    const userId = req.user.id;
    
    try {
      // Check seat availability
      const seat = await prisma.seat.findUnique({
        where: { id: seatId },
      });
      
      if (!seat || seat.status !== 'AVAILABLE') {
        return res.status(400).json({ error: 'Seat not available.' });
      }
  
      // Create booking
      const booking = await prisma.booking.create({
        data: {
          userId,
          seatId,
          trainId,
          status: 'CONFIRMED',
        }
      });
      
      // Update seat status
      await prisma.seat.update({
        where: { id: seatId },
        data: {
          status: 'RESERVED',
          reservedFromStopId: boardingStop,
          reservedToStopId: destinationStop,
        },
      });
  
      res.status(201).json({ message: 'Booking confirmed!', booking });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

// Cancel a booking
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
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }
  
      // Check if the user owns the booking
      if (booking.userId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
      }
  
      // Check if the booking is already canceled
      if (booking.status === 'CANCELLED') {
        return res.status(400).json({ success: false, message: 'Booking is already canceled.' });
      }
  
      // Update the booking status to CANCELLED
      await prisma.booking.update({
        where: { id: parseInt(id) },
        data: {
          status: 'CANCELLED', // Update status to 'CANCELLED'
        },
      });
  
      // If the booking has a seat, free up the seat
      if (booking.seatId) {
        // Update the seat status to 'AVAILABLE' and clear the reservedFromStopId and reservedToStopId
        await prisma.seat.update({
          where: { id: booking.seatId },
          data: {
            status: 'AVAILABLE',
            reservedFromStopId: null,
            reservedToStopId: null,
          },
        });
  
        // Handle waitlist: Check for any waitlisted booking for this train
        const waitlistedBooking = await prisma.booking.findFirst({
          where: {
            status: 'WAITLIST',
            trainId: booking.trainId,
          },
          orderBy: { createdAt: 'asc' }, // Assign the earliest waitlisted booking
        });
  
        if (waitlistedBooking) {
          // Update the waitlisted booking to 'CONFIRMED' and assign the seat
          await prisma.booking.update({
            where: { id: waitlistedBooking.id },
            data: { status: 'CONFIRMED', seatId: booking.seatId },
          });
  
          // Update the seat status to 'RESERVED'
          await prisma.seat.update({
            where: { id: booking.seatId },
            data: { status: 'RESERVED' },
          });
        }
      }
  
      res.status(200).json({ success: true, message: 'Booking canceled successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to cancel booking.' });
    }
  };
  

// Fetch booking history
export const getBookingHistory = async (req, res) => {
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId: req.user.id },
        include: {
          train: true,
          seat: true,
        },
        orderBy: { createdAt: 'desc' },
      });
  
      if (bookings.length === 0) {
        return res.status(404).json({ success: false, message: 'No bookings found.' });
      }
  
      res.status(200).json({ success: true, bookings });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch booking history.' });
    }
  };
  