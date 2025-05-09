import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [pools, setPools] = useState([]);

  useEffect(() => {
    // Fetch user profile and pools
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        const userResponse = await fetch('http://localhost:5000/api/users/profile');
        const userData = await userResponse.json();
        setUser(userData);

        const poolsResponse = await fetch('http://localhost:5000/api/users/pools');
        const poolsData = await poolsResponse.json();
        setPools(poolsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        // Show success message
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Profile
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  variant="outlined"
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProfile}
                  fullWidth
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              My Pools
            </Typography>

            <List>
              {pools.length === 0 ? (
                <Typography>No pools created yet</Typography>
              ) : (
                pools.map((pool, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`Pool at ${pool.address}`}
                        secondary={`Status: ${pool.status} | Participants: ${pool.current_participants}/${pool.max_participants}`}
                      />
                    </ListItem>
                    {index < pools.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile; 