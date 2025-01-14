import prisma from '../config/prismaClient.js';

// Add a new train
// export const addTrain = async (req, res) => {
//   try {
//     const { name, trainNumber, routeGroupId } = req.body;

//     if (!name || !trainNumber || !routeGroupId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Name, train number, and route group ID are required.' 
//       });
//     }

//     // Fetch the route group's stops in order
//     const routes = await prisma.route.findMany({
//       where: { routeGroupId },
//       orderBy: { stopOrder: 'asc' },
//       include: { stop: true }
//     });

//     if (!routes.length) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Route not found.' 
//       });
//     }

//     // Create the train with start and end stops
//     console.log(routes);
    
//     const train = await prisma.train.create({
//       data: {
//         name,
//         trainNumber,
//         startStopId: routes[0].stopId,
//         endStopId: routes[routes.length - 1].stopId,
//         routeGroup: {
//           connect: { id: routeGroupId }  // Connect the train to the selected RouteGroup
//         },
//         route: {
//           create: routes.map(route => ({
//             stopId: route.stopId,
//             stopOrder: route.stopOrder,
//             routeGroupId
//           }))
//         }
//       },
//       include: {
//         startStop: true,
//         endStop: true,
//         route: {
//           include: {
//             stop: true
//           }
//         }
//       }
//     });

//     // Create 10 default seats for the new train
//     const seats = [];
//     for (let i = 1; i <= 10; i++) {
//       seats.push({
//         seatNumber: `S${i}`,
//         trainId: train.id,
//       });
//     }

//     // Insert the seats into the Seat table
//     await prisma.seat.createMany({
//       data: seats,
//     });

//     // Clean up routes with trainId = null
//     await prisma.route.deleteMany({
//       where: { trainId: null }
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Train and routes added successfully with 10 default seats.',
//       train
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error.' });
//   }
// };

export const addTrain = async (req, res) => {
  try {
    const { name, trainNumber, routeGroupId } = req.body;

    if (!name || !trainNumber || !routeGroupId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, train number, and route group ID are required.' 
      });
    }

    // Fetch the route group's stops in order
    const routes = await prisma.route.findMany({
      where: { routeGroupId },
      orderBy: { stopOrder: 'asc' },
      include: { stop: true }
    });

    if (!routes.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Route not found.' 
      });
    }

    // Create the train with start and end stops (use the relation)
    const train = await prisma.train.create({
      data: {
        name,
        trainNumber,
        // Use the stop relations, not the stop ids directly
        startStop: { connect: { id: routes[0].stopId } },  // Start stop from the first route stop
        endStop: { connect: { id: routes[routes.length - 1].stopId } },  // End stop from the last route stop
        RouteGroup: {
          connect: { id: routeGroupId }  // Connect the train to the selected RouteGroup
        },
        route: {
          create: routes.map(route => ({
            stopId: route.stopId,
            stopOrder: route.stopOrder,
            routeGroupId
          }))
        }
      },
      include: {
        startStop: true,
        endStop: true,
        route: {
          include: {
            stop: true
          }
        },
        RouteGroup: true // Include the RouteGroup data
      }
    });

    // Create 10 default seats for the new train
    const seats = [];
    for (let i = 1; i <= 10; i++) {
      seats.push({
        seatNumber: `S${i}`,
        trainId: train.id,
      });
    }

    // Insert the seats into the Seat table
    await prisma.seat.createMany({
      data: seats,
    });

    // Clean up routes with trainId = null
    await prisma.route.deleteMany({
      where: { trainId: null }
    });

    res.status(201).json({
      success: true,
      message: 'Train and routes added successfully with 10 default seats.',
      train
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


// Get all trains
export const getAllTrains = async (req, res) => {
  try {
    const trains = await prisma.train.findMany();
    res.status(200).json({ success: true, trains });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get a specific train by ID
export const getTrainById = async (req, res) => {
  try {
    const { id } = req.params;
    const train = await prisma.train.findUnique({
      where: { id: parseInt(id) },
    });

    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found.' });
    }

    res.status(200).json({ success: true, train });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update a train by ID
export const updateTrainById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, trainNumber, startStopId, endStopId } = req.body;

    // Validate input
    if (!name || !trainNumber || !startStopId || !endStopId) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Update train
    const updatedTrain = await prisma.train.update({
      where: { id: parseInt(id) },
      data: { name, trainNumber, startStopId, endStopId },
    });

    res.status(200).json({ success: true, message: 'Train updated successfully.', updatedTrain });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Train number must be unique.',
      });
    }
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete a train by ID
export const deleteTrainById = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete train
    const deletedTrain = await prisma.train.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ success: true, message: 'Train deleted successfully.', deletedTrain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
