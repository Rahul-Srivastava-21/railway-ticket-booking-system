import prisma from '../config/prismaClient.js';

// Add a new train
export const addTrain = async (req, res) => {
  try {
    const { name, trainNumber, startStopId, endStopId } = req.body;
    // Validate input
    if (!name || !trainNumber || !startStopId || !endStopId) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create train
    const train = await prisma.train.create({
      data: {
        name,
        trainNumber,
        startStopId,
        endStopId,
      },
    });

    res.status(201).json({ success: true, message: 'Train added successfully.', train });
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
