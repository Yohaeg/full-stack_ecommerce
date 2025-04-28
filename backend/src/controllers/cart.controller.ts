import { Request, Response } from 'express';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cartItem.model';
import { Product } from '../models/product.model';

// get cart items
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    // get userId from token authentication
    const userId = (req as any).userId;
    // find cart by userId
    const cart = await Cart.findOne({
      where: { user_id: userId }  
    });
    // find cart items by cartId
    if (cart) {
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: Product,
          as: 'product', // important to match the alias
        }
      ]
    });
    if(cartItems){
      // Calculate the total
      const total = cartItems.reduce((sum, item) => {
        return (item.product?.price as number || 0) * item.quantity as number + (sum as number) as number;
      }, 0);
     // simplify the cart items to be easy use in frontend
      const simplifiedCartItems = cartItems.map(item => ({
        id: item.product_id,
        quantity: item.quantity,
        name: item.product?.name,
        price: item.product?.price,
        image_key: item.product?.image_key
      }));
      
      // Sending JSON response
      res.json({ cartItems:simplifiedCartItems, total });
      return;
    }else{
      res.status(404).json({ message: 'Cart is empty' });
      return;
    }
  }else{ 
    res.status(404).json({ message: 'Cart not found' });
    return;
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
// add product to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    // get userId from token authentication
    const userId = (req as any).userId;
    // get productId from request body
    const productId = req.body.id;
    // find cart by userId
    let cart = await Cart.findOne({ where: { user_id: userId } });
   // if cart is not found, create a new cart
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }
    // find cart item by cartId and productId
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });
    // if cart item is not found, create a new cart item if found increment the quantity
    if (cartItem) {
      cartItem.quantity += 1; // increment quantity
      await cartItem.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity: 1,
      }); //create new cart item
    }
    // Sending JSON response
    res.status(201).json({ message: 'Product added to cart' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
// remove product from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    // get userId from token authentication
    const userId = (req as any).userId;
    // get productId from request params
    const { productId } = req.params;
    // find cart by userId
    const cart = await Cart.findOne({ where: { user_id: userId } });
    // delete cart item by cartId and productId
    if(cart){
    const deleted = await CartItem.destroy({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!deleted) {
      res.status(404).json({ message: 'Product not found in cart' });
      return;
    }
    // Sending JSON response
    res.json({ message: 'Product removed from cart' });
    return;
  } else {
    res.status(404).json({ message: 'Cart not found' });
    return;
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
// remove all products from cart
export const removeAllCart = async (req: Request, res: Response) => {
  try {
    // get userId from token authentication 
    const userId = (req as any).userId;
    // find cart by userId
    const cart = await Cart.findOne({ where: { user_id: userId } });
    // delete all cart items by cartId ans cart by userId
    if(cart){
    // delete all cart items
    await CartItem.destroy({ where: { cart_id: cart.id } });
    //delete cart
    await Cart.destroy({ where: { user_id: userId } });
    // Sending JSON response
    res.json({ message: 'All products removed from cart' });
    return;
  } else {
    res.status(404).json({ message: 'Cart not found' });
    return;
  } 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};


