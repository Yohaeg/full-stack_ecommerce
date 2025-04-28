import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model'; 
import {uploadProfileImage } from '../services/s3.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = async (req: Request, res: Response):Promise<void> => {
  try {
    const { name, email, password } = req.body;
   
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImageUrl = '';
    if(req.file){ 
      const file = req.file
      profileImageUrl = await uploadProfileImage(file); // Assuming S3 service handles the file upload
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profile_picture_key: profileImageUrl
    });

    res.status(201).json({ message: 'User registered successfully', user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};

export const login = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user){
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user? user.password:'');
    if (!isPasswordValid){ 
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user? user.id:'' }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return; 
  }
};

export const getUserFromToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; 
  } catch (error) {
    console.error('Invalid Token:', error);
    return null;
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }


    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profile_picture_key,
    });
    return;
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};

