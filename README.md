# Product Browser Application – Full Stack Solution

## Overview

This project is a full-stack web application that enables users to:

- **Register and Login:** User registration with image upload to AWS S3 and JWT-based authentication (frontend and backend with database integration).
- **Product Browsing:** Browse products with images stored in S3 (frontend and backend with database).
- **Shopping Cart:** Persistent shopping cart management (frontend and backend with database).
- **Shipping Addresses:** Manage multiple shipping addresses (stored in a MySQL `user_addresses` table).

---

## Technologies Used

- **Backend:** Node.js (TypeScript) with Express.js, AWS Lambda (via `@vendia/serverless-express`), AWS S3 (using `aws-sdk`), MySQL.
- **Frontend:** Angular.
- **Database:** MySQL (local setup via `schema.sql` and `db-setup.js`).
- **Image Storage:** AWS S3.

---

## AWS IAM Policy for S3 Access

No additional configuration required. Example IAM policy for S3 access:

```json
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
```

---

## Backend Setup (Node.js)

1. **Navigate to the backend directory.**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally (if not already installed):**
   ```bash
   npm install -g @angular/cli
   ```

4. **Resolve potential type conflicts:**
   ```bash
   npm remove @types/sequelize
   npm install --save-dev @types/dotenv
   ```

5. **Set up MySQL database:**
   ```bash
   node db-setup.js
   ```

6. **Update `package.json`:**
   - Change `"type": "commonjs"` to `"type": "module"` to use ES module imports.

7. **Configure environment variables (`.env`):**
   ```
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_db
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET=your_s3_bucket
   PORT=3000
   NODE_ENV=development  # or 'production' for serverless Lambda
   ```

8. **Run the backend locally:**
   ```bash
   npm run start
   ```

---

## Frontend Setup (Angular)

1. **Install Angular CLI globally:**
   ```bash
   npm install -g @angular/cli
   ```

2. **Create a new Angular application:**
   ```bash
   ng new frontend
   cd frontend
   ```

3. **Start the development server:**
   ```bash
   ng serve
   ```

4. **Project Structure:**
   ```
   src/
   └── app/
       ├── auth/         # Login/Register components
       ├── products/     # Product list and Add
       ├── cart/         # Cart for each user
       ├── services/     # AuthService, CartService
       └── app-routing.module.ts
   ```

5. **Generate Components:**
   ```bash
   ng generate component auth/login
   ng generate component auth/register
   ng generate component products/product-list
   ng generate component products/add-product
   ng generate component cart/cart
   ```

6. **Generate Services:**
   ```bash
   ng generate service services/cart
   ```

7. **Install frontend dependencies:**
   ```bash
   npm install
   ```

8. **Set up environment variables:**
   - Create `src/app/environments/environment.ts`:
     ```typescript
     export const environment = {
       production: false,
       apiUrl: 'http://localhost:3000/api'  // Development API
     };
     ```

9. **Run the frontend locally:**
   ```bash
   npm run start
   ```

---

## API Endpoints

### Users

- `POST /user/register` – User registration
- `POST /user/login` – User login
- `GET /user/profile` – Get user profile (requires token)

### Products

- `GET /product` – Get all products
- `POST /product/add-product` – Add a new product

### Cart

- `GET /cart/getcart` – Get user's cart (requires token)
- `POST /cart` – Add item to cart (requires token)
- `DELETE /cart/{productId}` – Remove item from cart (requires token)
- `GET /cart/delete` – Clear cart (requires token)

### Address

- `POST /address` – Add new address for user (requires token)
- `GET /address/user` – Get all addresses for user (requires token)

---

## Postman Collection

- Import the Postman collection from `e-commerce_backend.postman_collection.json` for API testing.

---

## Troubleshooting

- **S3 Access Denied:** Ensure IAM policies are correctly attached to Lambda roles.
