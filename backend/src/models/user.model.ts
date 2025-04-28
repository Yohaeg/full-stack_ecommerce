import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connectDB';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public profile_picture_key?: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    profile_picture_key: { type: DataTypes.STRING(255), allowNull: true }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false
  }
);
