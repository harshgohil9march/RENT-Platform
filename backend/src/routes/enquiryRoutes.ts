import express from 'express';
import { createEnquiry, getOwnerEnquiries } from '../controllers/enquiryController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Mount routes directly
router.post('/properties/:id/enquiries', createEnquiry);
router.get('/enquiries/me', requireAuth, getOwnerEnquiries);

export default router;