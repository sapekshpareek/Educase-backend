import { Request, Response, Router } from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import User from '../models/User';
import { AuthRequest, LoginCredentials, RegisterData } from '../types';
import { loginValidation, registerValidation } from '../validations/auth';

const router = Router();

// Register
router.post(
  '/register',
  validate(registerValidation),
  async (req: Request<{}, {}, RegisterData>, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      // Create new user
      const user = new User({ email, password, name });
      await user.save();

      // Generate token
      const token = user.generateAuthToken();

      res.status(201).json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  }
);

// Login
router.post(
  '/login',
  validate(loginValidation),
  async (req: Request<{}, {}, LoginCredentials>, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Generate token
      const token = user.generateAuthToken();

      res.json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
  }
);

// Get current user
router.get('/me', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

export default router; 