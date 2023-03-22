// eslint-disable-next-line import/no-extraneous-dependencies
import Joi from 'joi';

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const Password = Joi.object({
  oldPassword: Joi.string()
    .min(4)
    .required(),
  newPassword: Joi.string()
    .min(4)
    .required(),
  confirmPassword: Joi.ref('newPassword')
});

export { userSchema, Password};
