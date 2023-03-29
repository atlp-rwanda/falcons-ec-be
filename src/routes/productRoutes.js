/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import multer from 'multer';
import express from 'express';
import path from 'path';
import isLoggedIn, { checkPassword } from '../middleware/authMiddleware';
import verifyRole from '../middleware/verifyRole';
import CreateProduct from '../controllers/productController';
import validator from '../validations/validation';
import productSchema from '../validations/Product';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const productRoute = express.Router();

productRoute.post(
  '/products',
  isLoggedIn,
  verifyRole('seller'),
  checkPassword,
  upload.array('images', 8),
  (req, res, next) => {
    if (req.files && req.files.length < 4) {
      return res.status(400).send('At least 4 images are required');
    }
    next();
  },
  validator(productSchema),

  CreateProduct,
);

export default productRoute;
