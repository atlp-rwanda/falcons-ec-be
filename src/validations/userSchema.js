/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
const Password = Joi.object({
  oldPassword: Joi.string().min(4).required(),
  newPassword: Joi.string().min(4).required(),
  confirmPassword: Joi.ref('newPassword')
});
const profileSchema = Joi.object({
  firstname: Joi.string()
    .min(3)
    .pattern(/^[a-zA-Z0-9\s]+$/),
  lastname: Joi.string()
    .min(3)
    .pattern(/^[a-zA-Z0-9\s]+$/),
  birthDate: Joi.date().max('now').iso(),
  gender: Joi.string().valid('male', 'female', 'other').insensitive().trim(),
  preferredLanguage: Joi.string().min(3),
  preferredCurrency: Joi.string().min(3),
  billingAddress: Joi.object({
    province: Joi.string().min(3),
    district: Joi.string().min(3),
    sector: Joi.string().min(2),
    cell: Joi.string().min(3),
    street: Joi.string().min(3)
  })
});
const orderItemStatus = Joi.object({
  status: Joi.string().valid('canceled', 'approved')
});
const passwordResetSchema = Joi.object({
  password: joiPassword.string().min(8).minOfUppercase(1).minOfNumeric(1).required().trim(),
  confirmPassword: Joi.ref('password')
});

export { userSchema, Password, profileSchema, passwordResetSchema, orderItemStatus };
