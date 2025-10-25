import express from 'express';
import { uploadCases, getAssignedCases, updateCaseStatus } from '../controllers/caseController.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/upload', authenticateJWT, authorizeRoles('Admin', 'Team Lead'), uploadCases);
router.get('/', authenticateJWT, authorizeRoles('Admin', 'Team Lead', 'Agent'), getAssignedCases);
router.patch('/:id/update-status', authenticateJWT, authorizeRoles('Admin', 'Team Lead'), updateCaseStatus);

export default router;