import db from '../database/models/index';
// import blacklisToken from '../database/models/blacklistoken';

const { User, blacklisToken} = db;

const findOneUserService = async (id) => {
  const findOneUserRequest = await User.findOne({ where: { id } });
  return findOneUserRequest;
};

export const logoutUser = async (data)=>{

  const token = data.split(' ')[1]
  await blacklisToken.create({token})
}

export default findOneUserService;
