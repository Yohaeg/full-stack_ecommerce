import { Request, Response } from 'express';
import { Address } from '../models/address.model';


  // Create a new address for user
  export const createAddress = async(req: Request, res: Response):Promise<void> => {
    try {
       // get userId from token authentication
      const user_id = (req as any).userId;
      const { street, city, state, zip_code, is_default } = req.body;
      const existingAddress = await Address.findOne({where: { user_id:user_id, is_default: true }});
      if (is_default && existingAddress) {
        await Address.update(
          { is_default: false },
          { where: { user_id, is_default: true } }
        );
      }

      const address = await Address.create({
        user_id,
        street,
        city,
        state,
        zip_code,
        is_default
      });

      res.status(201).json({message: 'Address created successfully', data: address});
      return;   
    } catch (error) {
      res.status(500).json({ message: 'Failed to create address',error: error});
      return;
  }
  };

  // Get all addresses for a user
  export const getUserAddresses = async(req: Request, res: Response):Promise<void> => {
    try {
      // get userId from token authentication
      const user_id = (req as any).userId;
      
      const addresses = await Address.findAll({
        where: { user_id: parseInt(user_id) },
        order: [['is_default', 'DESC']] // Default address first
      });

      res.status(200).json({ data: addresses });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch addresses', error: error});
      return;
    }
  };