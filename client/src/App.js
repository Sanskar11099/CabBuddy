import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { io } from 'socket.io-client';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePool from './pages/CreatePool';
import JoinPool from './pages/JoinPool';
import Profile from './pages/Profile';

// Create socket connection
const socket = io('http://localhost:5000');

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/create-pool" element={<CreatePool socket={socket} />} />
          <Route path="/join-pool" element={<JoinPool socket={socket} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
