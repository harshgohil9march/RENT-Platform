import  express  from "express";

import { createProperty, getPropertyById, deleteProperty, getProperties, updateProperty } from "../controllers/propertyController";

const router = express.Router(); 

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', createProperty);
router.patch(':id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;