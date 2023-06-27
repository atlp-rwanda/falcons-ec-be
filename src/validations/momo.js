import Joi from 'joi';

const momoSchema = Joi.object({
  phone: Joi.string()
    .required()
    .regex(/^(078|079)\d{7}$/)
    .message('Phone must start with 078 or 079 and be 10 digits long'),
});
export default momoSchema;
