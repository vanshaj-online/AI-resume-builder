import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume
} from '../controllers/resume.controller';

const router = Router();

// Apply the 'protect' middleware to all routes in this file automatically
router.use(protect);

// Map routes to controller functions
router.route('/')
  .post(createResume)
  .get(getResumes);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

export default router;