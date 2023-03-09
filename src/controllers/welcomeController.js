import * as dotenv from "dotenv";
dotenv.config();

export const welcome = async (req, res) => {
  console.log("Test controller OK");
  return res.status(200).json({ message: "Test controller OK" });
};

export default welcome;
