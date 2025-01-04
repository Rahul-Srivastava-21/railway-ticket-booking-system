import prisma from '../config/prismaClient.js';

// Search for trains
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
          { route: { some: { stopId: { lte: boardingStop } } } }, // Stop before or at boarding
          { route: { some: { stopId: { gte: destinationStop } } } }, // Stop after or at destination
        ],
      },
      include: {
        route: true,
        seats: {
          where: {
            status: 'available',
            stopId: {
              gte: boardingStop,
              lt: destinationStop,
            },
          },
        },
      },
    });

    // Filter trains with available seats
    const availableTrains = trains.filter(train => train.seats.length > 0);

    res.status(200).json({ availableTrains });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trains. Please try again.' });
  }
};
