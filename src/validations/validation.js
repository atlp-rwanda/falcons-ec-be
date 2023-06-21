const validator = (Schema) => (req, res, next) => {
  const { error } = Schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }
  next();
};
export const validateSearch = (Schema) => (req, res, next) => {
  const { error } = Schema.validate(req.query);
  if (error) {
    return res.status(400).send(error.message);
  }
  next();
};

export const validation = (Schema) => (res, req, next) => {
  const { err } = Schema.validate(req.body, {
    abortEarly: false,
  });
  if (err) {
    return res
      .status(400)
      .json({ error: err.details[0].message.replace(/[^a-zA-Z0-9]/g, '') });
  }
  next();
};

export default validator;
