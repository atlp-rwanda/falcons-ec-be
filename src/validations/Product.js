import joi from 'joi';

const productSchema = joi.object({
  productName: joi.string().required(),
  quantity: joi.number().min(0).required(),
  price: joi.number().min(0).required(),
  description: joi.string().required(),
  expiryDate: joi.date().min('now').required(),
  images: joi.array(),
  category_id: joi.string().required(),
});

export default productSchema;
