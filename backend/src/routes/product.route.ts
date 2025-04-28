import { Router } from 'express';
import multer from 'multer';
import { listProducts ,addProduct, uploadImage } from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(), // or diskStorage if you prefer
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });
router.get('/', listProducts);
router.post('/add-product',upload.single('file'), addProduct);
// router.post('/upload/:id', authenticateToken, uploadImage);      

export default router;
