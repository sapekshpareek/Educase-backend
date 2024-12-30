import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import { errorHandler } from './middleware/error';
import Form from './models/Form';
import authRoutes from './routes/auth';
import formRoutes from './routes/forms';
import submissionRoutes from './routes/submissions';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB:', config.mongoUri);
    try {
      const forms = await Form.find();
      console.log('Current forms in database:', forms);
    } catch (err) {
      console.error('Error checking forms:', err);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

export default app; 