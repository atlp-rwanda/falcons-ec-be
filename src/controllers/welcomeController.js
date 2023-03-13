import * as dotenv from 'dotenv';

dotenv.config();

const welcome = async (req, res) => res.json({ message: 'Test controller OK' });

export default welcome;
