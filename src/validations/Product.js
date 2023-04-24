import joi from 'joi';

const productSchema = joi.object({
  productName: joi
    .string()
    .min(3)
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .required(),
  quantity: joi.number().min(0).required(),
  price: joi.number().min(0).required(),
  description: joi.string().required(),
  expiryDate: joi.date().min('now').required(),
  images: joi.array(),
  category_id: joi.string().required()
});

export const searchSchema = joi.object({
  name: joi.string().min(1),
  description: joi.string().min(1),
  maxPrice: joi.number().min(1),
  minPrice: joi.number().min(1),
  category: joi.string().min(1)
});
export default productSchema;
