import joi from 'joi';

const reviewSchema = joi.object({
  ratings: joi.number().integer().min(0).max(5).required(),
  feedback: joi.string().min(1).max(15).required()
});

export default reviewSchema;
