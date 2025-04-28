import { sequelize } from '../connectDB';
import { User } from './user.model';
import { Product } from './product.model';
import { Cart } from './cart.model';
import { CartItem } from './cartItem.model';
import { Address } from './address.model';

// User - Address
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'user_id' });

// User - Cart
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart - CartItems
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'cartItems' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// Product - CartItems
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Sync
export const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    console.log('All models synced!');
  } catch (error) {
    console.error('Error syncing DB:', error);
  }
};
