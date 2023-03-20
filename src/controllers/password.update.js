import bcrypt from 'bcrypt';
import db from '../database/models';

const { User } = db;

// method to update the user password

const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    // find a user requesting yo update the password
    // compare his/her oldpassword to
    // password in the db
    const user = await User.findByPk(userId);
    const { oldPassword, newPassword } = req.body;
    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
      return res.status(403)
        .json({ error: 'Invalid password' });
    }
    // hash and update the new password in the db

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    await user.update({ password: hashPassword });
    await user.save();
    return res.status(200).json({ message: 'password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export default updatePassword;
