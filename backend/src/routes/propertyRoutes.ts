import  express  from "express";

import { createProperty, getPropertyById, deleteProperty, getProperties, updateProperty, getMyProperties } from "../controllers/propertyController";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router(); 

// public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Protected routes(Require login)
router.get('/me/all', requireAuth, getMyProperties);
router.post('/', requireAuth, createProperty);
router.patch('/:id', requireAuth, updateProperty);
router.delete('/:id',requireAuth, deleteProperty);

export default router;