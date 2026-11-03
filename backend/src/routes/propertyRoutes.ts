import  express  from "express";

import { getProperties } from "../controllers/propertyController";
import { getPropertyById } from "../controllers/propertyController";

const router = express.Router(); 

router.get('/', getProperties);
router.get('/:id', getPropertyById);

export default router;