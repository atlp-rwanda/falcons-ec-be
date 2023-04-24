import Joi from 'joi';

const productWishlistSchema = Joi.object({
  product_id: Joi.string().required(),
});

export default productWishlistSchema;
