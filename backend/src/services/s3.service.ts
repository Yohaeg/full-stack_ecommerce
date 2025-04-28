import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ManagedUpload } from 'aws-sdk/clients/s3';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});

const BUCKET_NAME = process.env.S3_BUCKET!;

export const uploadProfileImage = async (file: Express.Multer.File): Promise<string> => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const params: AWS.S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: `profiles/${fileName}`, 
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read'
  };

  const uploadResult: ManagedUpload.SendData = await s3.upload(params).promise();
  return uploadResult.Location; 
};


export const uploadProductImage = async (file: Express.Multer.File): Promise<string> => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const params: AWS.S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: `products/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read'
  };

  const uploadResult: ManagedUpload.SendData = await s3.upload(params).promise();
  return uploadResult.Location;
};
