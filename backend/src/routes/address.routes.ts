import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { createAddress , getUserAddresses } from '../controllers/address.controller';

const router = express.Router();

router.post('/',authenticateToken ,createAddress);
router.get('/user', authenticateToken, getUserAddresses);


export default router;