/* eslint-disable linebreak-style */
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../database/models/index';
import cloudinary from '../uploads';

dotenv.config();
const { Product } = db;

const CreateProduct = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);
    const existingProduct = await Product.findOne({
      where: {
        productName: req.body.productName,
        seller_id: decodedData.payload.id,
      },
    });

    if (existingProduct) {
      return res.status(409).json({ error: 'Product already exists' });
    }

    const product = await Product.create({
      productName: req.body.productName,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      seller_id: decodedData.payload.id,
      expiryDate: new Date(),
      category_id: req.body.category_id,
    });
    if (req.files) {
      const promises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: 'Falcons_E-comm_App/ProductImages',
          public_id: `${product.productName}_image`,
        }),
      );

      const results = await Promise.all(promises);
      product.images = results.map((result) => result.url).filter((url) => url);
      await product.save();
    }

    return res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default CreateProduct;
