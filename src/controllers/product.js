import * as dotenv from 'dotenv';
import db from '../database/models/index';
import cloudinary from '../../uploads';

dotenv.config();
const { Product } = db;

const CreateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findOne({
      where: {
        productName: req.body.productName,
        seller_id: '57409d12-ddad-4938-a37a-c17bc33aa4ba',
      },
    });

    if (existingProduct) {
      return res.status(401).json({ error: 'Product already exists' });
    }

    const product = await Product.create({
      productName: req.body.productName,
      //   category:req.body.category,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      categoryName: req.body.categoryName,
      seller_id: '57409d12-ddad-4938-a37a-c17bc33aa4ba',
      expiryDate: new Date(),
    });
    if (req.files) {
      const promises = req.files.map((file) =>
        // eslint-disable-next-line implicit-arrow-linebreak
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
    res.status(401).json({ error: error.message });
  }
};

export default CreateProduct;
