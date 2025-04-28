import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connectDB';

export class Address extends Model {
  public id!: number;
  public user_id!: number;
  public street!: string;
  public city!: string;
  public state!: string;
  public zip_code!: string;
  public is_default!: boolean;
}

Address.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    street: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    state: { type: DataTypes.STRING(100), allowNull: false },
    zip_code: { type: DataTypes.STRING(20), allowNull: false },
    is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'user_addresses',
    timestamps: false
  }
);
