import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'LMS Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
