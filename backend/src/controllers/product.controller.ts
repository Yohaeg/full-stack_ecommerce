import e, { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { uploadProductImage } from '../services/s3.service';

// get product from database
export const listProducts = async (_req: Request, res: Response):Promise<void> => {
  try {
    // Fetch all products from the database
    const products = await Product.findAll();
    res.json(products);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
// get product by id
export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price } = req.body;

    // Validate product details
    if (!name || !price) {
     res.status(400).json({ message: 'Missing required fields' });
     return;
    }
   // Check if the file(image) already exists
    let image_key = '';
    if(req.file){ 
      const file = req.file
      image_key = await uploadProductImage(file); // Assuming S3 service handles the file upload
    }
    else{ 
      res.status(400).json({ message: 'Missing image file' });
      return;
    }
    // Create new product in the database
    const newProduct = await Product.create({
      name,
      description,
      price,
      image_key
    });
    // Send response
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};

export const uploadImage = async (req: Request, res: Response): Promise<void> => { 
  try{
    let imageUrl = '';
      if(req.file){ 
        const file = req.file
        imageUrl = await uploadProductImage(file); 
      }
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      product.image_key = imageUrl;
      await product.save();
      res.status(200).json({ message: 'Image uploaded successfully', product });
      return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
}
