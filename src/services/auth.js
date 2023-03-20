import db from '../database/models/index';

const { User } = db;

const findOneUserService = async (id) => {
  const findOneUserRequest = await User.findOne({ where: { id } });
  return findOneUserRequest;
};

export default findOneUserService;
