import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connectDB';

export class Cart extends Model {
  public id!: number;
  public user_id!: number;
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: 'carts',
    timestamps: false,
  }
);
