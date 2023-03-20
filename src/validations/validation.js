const validator = (Schema) => (req, res, next) => {
  const { error } = Schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  next();
};

export default validator;
