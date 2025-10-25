import express from 'express';
import { getSummary } from '../controllers/analyticsController.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/summary', authenticateJWT, authorizeRoles('Admin', 'Team Lead'), getSummary);

export default router;