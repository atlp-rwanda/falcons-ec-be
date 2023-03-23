import joi from 'joi';

const categorySchema = joi.object({
  categoryName: joi.string().required(),
});

export default categorySchema;
