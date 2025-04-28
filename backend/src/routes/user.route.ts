import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middlewares/auth.middleware';
import { register, login, getProfile } from '../controllers/user.controller';

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(), // or diskStorage if you prefer
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });
  
router.post('/register', upload.single('file'), register);
router.post('/login', login);
router.get('/profile',authenticateToken , getProfile);


export default router;
