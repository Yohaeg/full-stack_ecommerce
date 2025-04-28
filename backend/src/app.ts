import { syncDb } from './models';
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoute from './routes/user.route';
import productRoute from './routes/product.route';
import cartRoute from './routes/cart.route';
import addressRoute from './routes/address.routes';
import cors from 'cors';
import serverlessExpress from '@vendia/serverless-express';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Server is running...');
});

app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/address', addressRoute);



if (process.env.NODE_ENV === 'production') {
  // For AWS Lambda
  exports.handler = serverlessExpress({ app });
}
if (process.env.NODE_ENV === 'development') {
  // For local development
  app.listen(PORT, async() => {
    console.log(`Server is running on port ${PORT}`);
    await syncDb();
  });
}

