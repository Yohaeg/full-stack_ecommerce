import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connectDB';

export class Product extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public image_key!: string;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    image_key: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: false,
  }
);
