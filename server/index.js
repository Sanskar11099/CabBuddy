const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const socketIo = require('socket.io');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const serviceAccount = require('./service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Socket.io setup
const server = require('http').createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinPool', (data) => {
    socket.join(data.location);
    console.log(`User joined pool at ${data.location}`);
  });

  socket.on('createPool', (data) => {
    io.to(data.location).emit('newPool', data);
    console.log(`New pool created at ${data.location}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.post('/api/pools', (req, res) => {
  const { location, userId, maxParticipants } = req.body;
  const query = 'INSERT INTO pools (location, user_id, max_participants) VALUES (?, ?, ?)';
  
  db.query(query, [location, userId, maxParticipants], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, location, userId, maxParticipants });
  });
});

app.get('/api/pools/:location', (req, res) => {
  const { location } = req.params;
  const query = 'SELECT * FROM pools WHERE location = ? AND status = "active"';
  
  db.query(query, [location], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 