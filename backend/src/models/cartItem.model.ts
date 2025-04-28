import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connectDB';
import { Product } from './product.model';

export class CartItem extends Model {
  public id!: number;
  public cart_id!: number;
  public product_id!: number;
  public quantity!: number;
  public product?: Product; 
}

CartItem.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    cart_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  },
  {
    sequelize,
    tableName: 'cart_items',
    timestamps: false,
  }
);
