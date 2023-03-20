import Joi from 'joi';

const Password = Joi.object({
  oldPassword: Joi.string()
    .min(5)
    .required(),
  newPassword: Joi.string()
    .min(5)
    .required(),
  confirmPassword: Joi.ref('newPassword')
});

export default Password;
