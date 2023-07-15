const express = require('express');
const jwt = require('jsonwebtoken');
const turf = require('@turf/turf');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());

// Middleware for token validation
const authenticate = (req, res, next) => {
  const authToken = req.headers.authorization;

  // Check if the token matches the expected value
  if (authToken === '12345') {
    next(); // Authentication successful, proceed to the next middleware
  } else {
    res.status(401).json({ error: 'Unauthorized' }); // Authentication failed
  }
};

// GET request endpoint for testing
app.get('/api/intersections', authenticate, (req, res) => {
  res.send('Hello, this is the intersections API.');
});

// POST request endpoint
app.post('/api/intersections', authenticate, (req, res) => {
  // Check if the linestring is present in the request body
  if (!req.body.linestring) {
    return res.status(400).json({ error: 'Missing linestring in the request body' });
  }

  // Extract the linestring GeoJSON from the request body
  const { linestring } = req.body;

  try {
    // Perform intersection check using turf.js
    const intersectingLines = [];
    // Randomly generated lines (start and end points)
    const lines = generateRandomLines();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineString = turf.lineString(line);
      const intersection = turf.lineIntersect(lineString, linestring);

      if (intersection.features.length > 0) {
        const lineId = `L${i + 1}`;
        intersectingLines.push({
          lineId,
          point: intersection.features[0].geometry.coordinates,
        });
      }
    }

    if (intersectingLines.length === 0) {
      // No intersections found
      res.json([]);
    } else {
      // Intersections found
      // Write the intersections to a JSON file
      const outputFile = 'intersections.json';
      fs.writeFile(outputFile, JSON.stringify(intersectingLines, null, 2), (err) => {
        if (err) {
          console.error('Error writing intersections to file:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Intersections written to file:', outputFile);
          res.json({ message: 'Intersections written to file' });
        }
      });
    }
  } catch (error) {
    // Handle any other errors
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to generate random lines
function generateRandomLines() {
  const lines = [];
  for (let i = 0; i < 50; i++) {
    const startPoint = getRandomPoint();
    const endPoint = getRandomPoint();
    lines.push([startPoint, endPoint]);
  }
  return lines;
}

// Helper function to generate a random point
function getRandomPoint() {
  const latitude = Math.random() * 180 - 90;
  const longitude = Math.random() * 360 - 180;
  return [longitude, latitude];
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
