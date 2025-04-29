## Product Browser Application - Full Stack (AWS S3, Lambda, Node.js, Angular, MySQL)
# Overview
- This is a full-stack web application that allows users to:

- Register with image uploaded in AWS S3 and login with JWT authentication (frontend and backend with  Database)

- Browse products with images stored in S3 (frontend and backend with Database)

- Manage a persistent shopping cart (frontend and backend with Database)

- Manage multiple shipping addresses  (My SQL table (user_addresses))

## Technologies:

- MySQL database (local in schema.sql by using db-setup.js)
- Angular for frontend
- Node.js with express.js for backend (type script)
- trying to use lambda but it's my first time to use so I stablished it with serverless using 
@vendia/serverless-express 
- upload images in S3 by using ( aws-sdk , aws-sdk/clients/s3)


# This is IAM policies I didn't need any configuration 
Create IAM policies for S3 access:
json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::bucketName/profiles/*",
                "arn:aws:s3:::bucketName/products/*"
            ]
        }
    ]
}


## Backend Setup (Node.js):
- Navigate to the backend directory
# setup packages 
- npm install
if installed should do this 
- npm remove @types/sequelize
may have conflict
- npm install --save-dev @types/dotenv
# Setup My SQL
- node db-setup.js
# changed the package.json
- "type": "commonjs" to "type": "module" to use import instead of require
# Environment Variables (.env)
    DB_HOST= => host
    DB_USER= => database user
    DB_PASSWORD => database password
    DB_NAME => database name
    JWT_SECRET => JWT Secret 
    AWS_ACCESS_KEY => S3 Key
    AWS_SECRET_KEY => S3 Secret
    AWS_REGION => S3 Region
    S3_BUCKET => S3 BUCKET NAME
    PORT => port
    NODE_ENV => (development for local , production for using serverless lambda)
# Example:
    DB_HOST=127.0.0.1
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    JWT_SECRET=
    AWS_ACCESS_KEY=
    AWS_SECRET_KEY=
    AWS_REGION=us-east-1
    S3_BUCKET=
    PORT=3000
    NODE_ENV=development
## Running Locally:
   npm run start

## Frontend Setup (Angular)
# Install Angular CLI:
- npm install -g @angular/cli
# Create a New Angular App:
- ng new frontend
# Navigate into Your Project:
- cd frontend
# Start the Development Server
- ng serve

src/
├── app/
│   ├── auth/         # Login/Register components
│   ├── products/     # Product list and Add
│   ├── cart/         # Cart for each user
│   ├── services/     # AuthService, CartService
│   └── app-routing.module.ts


# Generate Pages:
- ng generate component auth/login
- ng generate component auth/register
- ng generate component products/product-list
- ng generate component products/add-product
- ng generate component cart/cart


#  Generate Services:
- ng generate service services/cart

# Navigate to the frontend directory
# setup packages 
- npm install
# Environment Variables
    Create src/app/environments/environment.ts with:
    export const environment = {
        production: false,
        apiUrl: 'http://localhost:3000/api'  // Development API
    };

## Running Locally:
- npm run start

## API Endpoints
# Users
- POST /user/register - User registration
- POST /user/login - User login
- get /user/profile - User profile(token)

# Products
- GET /product - Get all products
- POST /product/add-product - add product

# Cart
- GET /cart/getcart - Get user's cart(token)
- POST /cart - Add item to cart(token)
- DELETE /cart/{productId} - Remove item from cart(token)
- GET /cart/delete - Remove all items (clear cart)(token)

# Addres
- POST /address - Add new address for user(token)
- GET /address/user - Get all addresses for user (token)

## Postman Collection
- Import the Postman collection from (e-commerce_backend.postman_collection.json)

## Troubleshooting:
- S3 Access Denied: Verify IAM policies are attached to Lambda roles