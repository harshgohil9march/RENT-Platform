import express from 'express';
import { requireAuth} from '../middleware/authMiddleware';
import {upload} from '../config/cloudinary';

const router = express.Router();

router.post('/', requireAuth, upload.single('image'), (req,res): any =>{
    // The upload.single('image') middleware handles the file buffer and sends it to Cloudinary
    if(!req.file){
        return res.status(400).json({message: 'No file uploaded' });
    }
    // req.file.path contains the live Cloudinary URL
    res.json({imageUrl: req.file.path});
});

router.use((error: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({ message: 'Image upload failed' });
    }

    next();
});

export default router;