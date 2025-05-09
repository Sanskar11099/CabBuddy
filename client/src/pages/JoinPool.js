import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

function JoinPool({ socket }) {
  const { id } = useParams();
  const [pool, setPool] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

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

    // Fetch pool details
    const fetchPool = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pools/${id}`);
        const data = await response.json();
        setPool(data);
        setParticipants(data.participants || []);
      } catch (error) {
        console.error('Error fetching pool:', error);
      }
    };

    fetchPool();

    // Listen for pool updates
    socket.on('poolUpdate', (updatedPool) => {
      if (updatedPool.id === id) {
        setPool(updatedPool);
        setParticipants(updatedPool.participants);
      }
    });

    return () => {
      socket.off('poolUpdate');
    };
  }, [id, socket]);

  const handleJoinPool = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pools/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'current-user-id' }), // Replace with actual user ID
      });

      if (response.ok) {
        socket.emit('joinPool', { poolId: id });
      }
    } catch (error) {
      console.error('Error joining pool:', error);
    }
  };

  if (!pool) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Join Pool
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={pool.location}
                zoom={14}
              >
                <Marker position={pool.location} />
                {userLocation && <Marker position={userLocation} />}
              </GoogleMap>
            </LoadScript>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Pool Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              Address: {pool.address}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Maximum Participants: {pool.max_participants}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Current Participants: {pool.current_participants}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Participants
            </Typography>
            <List>
              {participants.map((participant, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={participant.name}
                      secondary={`Joined at ${new Date(participant.joined_at).toLocaleString()}`}
                    />
                  </ListItem>
                  {index < participants.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleJoinPool}
              disabled={pool.current_participants >= pool.max_participants}
              fullWidth
            >
              {pool.current_participants >= pool.max_participants
                ? 'Pool is Full'
                : 'Join Pool'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default JoinPool; 