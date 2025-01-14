import prisma from '../config/prismaClient.js';

// Add a new train route
export const addTrainRoute = async (req, res) => {
  try {
    const { stopIds } = req.body;

    if (!stopIds || stopIds.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least two stops are required.' 
      });
    }

    // Create a new route group
    const routeGroup = await prisma.routeGroup.create({
      data: {}
    });

    // Create route entries for each stop
    const routeEntries = await Promise.all(stopIds.map((stopId, index) => {
      return prisma.route.create({
        data: {
          stopId,
          stopOrder: index + 1,
          routeGroupId: routeGroup.id
        }
      });
    }));

    res.status(201).json({
      success: true,
      message: 'Route template created successfully',
      routeGroupId: routeGroup.id,
      routes: routeEntries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update a train route
export const updateTrainRoute = async (req, res) => {
  const { id } = req.params;
  const { stopId, stopOrder } = req.body;

  try {
    const existingRoute = await prisma.route.findUnique({ where: { id: parseInt(id) } });

    if (!existingRoute) {
      return res.status(404).json({ success: false, message: 'Route not found.' });
    }

    // Update route
    const updatedRoute = await prisma.route.update({
      where: { id: parseInt(id) },
      data: { stopId, stopOrder },
    });

    res.status(200).json({ success: true, message: 'Route updated successfully.', route: updatedRoute });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete a train route
export const deleteTrainRoute = async (req, res) => {
  const { id } = req.params;

  try {
    const routeToDelete = await prisma.route.findUnique({ where: { id: parseInt(id) } });

    if (!routeToDelete) {
      return res.status(404).json({ success: false, message: 'Route not found.' });
    }

    // Delete route
    await prisma.route.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ success: true, message: 'Route deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
