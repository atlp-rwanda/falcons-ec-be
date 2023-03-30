// eslint-disable-next-line import/no-extraneous-dependencies
import Joi from 'joi';

const roleSchema = Joi.object({
  role: Joi.string().valid('buyer', 'seller', 'admin').required(),
});

export default roleSchema;
