import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Container, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

function Home({ socket }) {
  const [activePools, setActivePools] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Listen for new pools
    socket.on('newPool', (pool) => {
      setActivePools((prevPools) => [...prevPools, pool]);
    });

    return () => {
      socket.off('newPool');
    };
  }, [socket]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to CabBuddy
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Find and join cab pools near you
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation || center}
                zoom={12}
              >
                {userLocation && <Marker position={userLocation} />}
                {activePools.map((pool, index) => (
                  <Marker
                    key={index}
                    position={pool.location}
                    onClick={() => navigate(`/join-pool/${pool.id}`)}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Pools
            </Typography>
            {activePools.length === 0 ? (
              <Typography>No active pools in your area</Typography>
            ) : (
              activePools.map((pool, index) => (
                <Paper key={index} sx={{ p: 2, mb: 1 }}>
                  <Typography variant="subtitle1">
                    Pool at {pool.location}
                  </Typography>
                  <Typography variant="body2">
                    {pool.current_participants} / {pool.max_participants} participants
                  </Typography>
                </Paper>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home; 