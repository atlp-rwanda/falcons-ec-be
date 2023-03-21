import multer from 'multer';
import express from 'express';
import path from 'path';
import isLoggedIn, { isSeller } from '../middleware/authMiddleware';
import CreateProduct from '../controllers/productController';
import validator from '../validations/validation'
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
  isSeller,
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
