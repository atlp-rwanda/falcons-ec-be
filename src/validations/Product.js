import joi from 'joi';

const productSchema = joi.object({
  productName: joi.string().required(),
  quantity: joi.number().min(0).required(),
  price: joi.number().min(0).required(),
  description: joi.string().required(),
  expiryDate: joi.date().required(),
  images: joi.array(),
});

export default productSchema;
