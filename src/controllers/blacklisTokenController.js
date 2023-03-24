import { logoutUser } from '../services/authService';

export const logout = async (req, res) => {
  try {
  logoutUser(req.headers.authorization)
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
