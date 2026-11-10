// this is a server file

import express from 'express'; 
// Express is a framework that makes building backend APIs easy. Without it, reading HTTP requests in raw Node.js takes hundreds of lines of code.

import cors from 'cors'; 
// CORS (Cross-Origin Resource Sharing) is a security guard. By default, a backend on port 5000 will block requests from a frontend on port 5173. We import this to tell the backend to allow our React app to talk to it.

import dotenv from 'dotenv';
// This package reads your hidden `.env` file and "loads" those secret variables (like your DB password) into the application.

import './config/db';
// This "executes the database connection" code the moment the server starts.

import cookieParser from 'cookie-parser';
// Allows Express to read secure cookies sent by the browser.

import propertyRoutes from './routes/propertyRoutes';
import authRoutes from './routes/authRoutes';
import  uploadRoutes  from './routes/uploadRoutes';
import enquiryRoutes   from './routes/enquiryRoutes';

dotenv.config();
// This "triggers" the reading of the `.env` file.

const app = express();
// This creates your actual server app object. We will attach all our routes (URLs) to this object.

const PORT = process.env.PORT || 5001;
// Uses the port from your .env file, or defaults to 5000.

app.use(cors({
  origin: 'http://localhost:5173', // Your React frontend URL
  credentials: true // This allows the secure token cookie to pass through
}));
// Tells the app to apply the CORS security pass to all incoming requests.
app.use(express.json());
// Crucial line: When React sends data (like a new user registration) in JSON format, this built-in middleware converts that raw JSON into a readable JavaScript object (req.body).
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ message: 'RENT-Platform Backend is healthy!' });
});
// A simple test route. If someone visits 'localhost:5000/api/health', the server responds with a JSON message.

app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes );
app.use('/api', enquiryRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Turns the server on and tells it to continuously listen for traffic on port 5000.

