# CabBuddy - Car Pooling Application

CabBuddy is a web application that enables users to create and join car pools based on their location. The application uses real-time location tracking and notifications to connect users who want to share rides.

## Features

- Real-time location tracking using Google Maps
- Create and join car pools
- User profile management
- Real-time notifications for pool updates
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- React.js
- Material-UI
- Google Maps API
- Socket.io-client

### Backend
- Node.js
- Express.js
- MySQL
- Socket.io
- Firebase Admin SDK

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- Google Maps API Key
- Firebase Project

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd CabBuddy
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:

Create a `.env` file in the server directory:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cabbuddy
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Create a `.env` file in the client directory:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Set up the database:
- Create a MySQL database named 'cabbuddy'
- Import the schema from `server/database.sql`

5. Set up Firebase:
- Create a new Firebase project
- Download the service account key and save it as `server/service-account-key.json`

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment

The application can be deployed to Firebase Hosting:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in the client directory:
```bash
cd client
firebase init
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. #   C a b B u d d y  
 