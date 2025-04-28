import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { getCart, addToCart, removeFromCart, removeAllCart } from '../controllers/cart.controller';

const router = express.Router();

router.get('/getcart', authenticateToken, getCart);
router.post('/',authenticateToken,addToCart);
router.delete('/:productId', authenticateToken, removeFromCart);
router.get('/delete', authenticateToken, removeAllCart);

export default router;
