import prisma from '../config/prismaClient.js';

// Search for trains based on boarding stop and destination stop
export const searchTrains = async (req, res) => {
  const { boardingStop, destinationStop } = req.query;

  try {
    // Ensure boarding and destination stops are valid
    if (!boardingStop || !destinationStop || boardingStop >= destinationStop) {
      return res.status(400).json({ error: 'Invalid boarding or destination stops.' });
    }

    // Find all trains covering the route
    const trains = await prisma.train.findMany({
      where: {
        AND: [
          { startStopId: { equals: parseInt(boardingStop) } }, // Ensure train starts at boarding stop
          { endStopId: { equals: parseInt(destinationStop) } }, // Ensure train ends at destination stop
        ],
      },
      include: {
        route: {
          where: {
            stopId: {
              gte: parseInt(boardingStop),
              lte: parseInt(destinationStop),
            },
          },
          include: {
            stop: true, // Include stop information in the route
          },
        },
        seats: {
          where: {
            status: 'AVAILABLE', // Only consider seats that are AVAILABLE
            OR: [
              {
                reservedFromStopId: null, // Consider seats with null reservedFromStopId (unreserved)
                reservedToStopId: null, // Consider seats with null reservedToStopId (unreserved)
              },
              {
                reservedFromStopId: { gte: parseInt(boardingStop) }, // Reserved seat is within the boarding stop range
                reservedToStopId: { lte: parseInt(destinationStop) }, // Reserved seat is within the destination stop range
              },
            ],
          },
        },
      },
    });    

    // Filter trains with available seats between boarding and destination stops
    const availableTrains = trains.filter(train => {
      return train.seats.some(seat => {
        return seat.status === 'AVAILABLE' &&
          (seat.reservedFromStopId === null && seat.reservedToStopId === null || // Unreserved seat
            (seat.reservedFromStopId >= parseInt(boardingStop) && seat.reservedToStopId <= parseInt(destinationStop)) // Reserved seat within the range
          );
      });
    });
    
    if (availableTrains.length === 0) {
      return res.status(404).json({ success: false, message: 'No available trains found.' });
    }

    res.status(200).json({ success: true, availableTrains });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch trains. Please try again.' });
  }
};
