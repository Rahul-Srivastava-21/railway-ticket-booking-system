import express from 'express';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Sample Route
app.get('/', (req, res) => {
  res.send('Express is working!');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
