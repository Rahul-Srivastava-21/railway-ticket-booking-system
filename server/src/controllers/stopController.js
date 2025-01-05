import prisma from '../config/prismaClient.js';

// Add a new stop
export const addStop = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Stop name is required.' });
    }

    // Create stop
    const stop = await prisma.stop.create({
      data: {
        name,
      },
    });

    res.status(201).json({ success: true, message: 'Stop added successfully.', stop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get all stops
export const getAllStops = async (req, res) => {
  try {
    const stops = await prisma.stop.findMany();
    res.status(200).json({ success: true, stops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get a specific stop by ID
export const getStopById = async (req, res) => {
  const { id } = req.params;
  try {
    const stop = await prisma.stop.findUnique({
      where: { id: parseInt(id) },
    });

    if (!stop) {
      return res.status(404).json({ success: false, message: 'Stop not found.' });
    }

    res.status(200).json({ success: true, stop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update a stop by ID
export const updateStopById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Stop name is required.' });
  }

  try {
    const stop = await prisma.stop.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.status(200).json({ success: true, message: 'Stop updated successfully.', stop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete a stop by ID
export const deleteStopById = async (req, res) => {
  const { id } = req.params;
  try {
    const stop = await prisma.stop.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ success: true, message: 'Stop deleted successfully.', stop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
