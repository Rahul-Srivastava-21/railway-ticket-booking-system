// ticketController.js
import prisma from '../config/prismaClient.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

// Fetch ticket details
export const fetchTicketDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        train: { include: { route: true } },
        seat: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.status(200).json({ success: true, ticket: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch ticket details.' });
  }
};

// Generate PDF ticket
export const generatePDFTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        train: { include: { route: true } },
        seat: true,
      },
    });
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const reservedFromStop = booking.seat.reservedFromStopId
  ? await prisma.stop.findUnique({
      where: { id: booking.seat.reservedFromStopId },
      select: { name: true },
    })
  : null;

    const reservedToStop = booking.seat.reservedToStopId
  ? await prisma.stop.findUnique({
      where: { id: booking.seat.reservedToStopId },
      select: { name: true },
    })
  : null;
    
  
    
    const doc = new PDFDocument();
    const pdfPath = `./src/tickets/ticket_${id}.pdf`;

    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);
    
    doc.fontSize(20).text('Ticket Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Booking ID: ${booking.id}`);
    doc.text(`User: ${booking.user.name} (${booking.user.email})`);
    doc.text(`Train: ${booking.train.name}`);
    doc.text(`Seat Number: ${booking.seat.seatNumber}`);
    doc.text(`From: ${reservedFromStop.name}`);
    doc.text(`To: ${reservedToStop.name}`);
    doc.text(`Status: ${booking.status}`);
    doc.text(`Date of Journey: ${booking.train.date}`);
    doc.end();

    writeStream.on('finish', () => {
      res.download(pdfPath, `ticket_${id}.pdf`, (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ success: false, error: 'Failed to download ticket.' });
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to generate ticket.' });
  }
};
