// eslint-disable-next-line import/no-extraneous-dependencies
import Joi from 'joi';

const otpSchema = Joi.object({
  otp: Joi.required(),
});

export default otpSchema;