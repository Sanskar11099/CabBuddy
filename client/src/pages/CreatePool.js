import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Slider,
  Box,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

function CreatePool({ socket }) {
  const [location, setLocation] = useState(null);
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleCreatePool = async () => {
    if (!location) return;

    const poolData = {
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      maxParticipants,
      address,
    };

    try {
      const response = await fetch('http://localhost:5000/api/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(poolData),
      });

      if (response.ok) {
        socket.emit('createPool', poolData);
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating pool:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Pool
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Select your location
            </Typography>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={location || { lat: 20.5937, lng: 78.9629 }}
                zoom={12}
                onClick={(e) => {
                  setLocation({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                }}
              >
                {location && <Marker position={location} />}
              </GoogleMap>
            </LoadScript>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Maximum Participants: {maxParticipants}
            </Typography>
            <Slider
              value={maxParticipants}
              onChange={(e, newValue) => setMaxParticipants(newValue)}
              min={2}
              max={8}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreatePool}
                disabled={!location}
              >
                Create Pool
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default CreatePool; 