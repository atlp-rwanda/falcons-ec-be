import joi from 'joi';

const productSchema = joi.object({
  productName: joi.string().required(),
  quantity: joi.number().required(),
  price: joi.number().required(),
  description: joi.string().required(),
  expiryDate: joi.date().required(),
  images: joi.array(),
});

export default productSchema;
