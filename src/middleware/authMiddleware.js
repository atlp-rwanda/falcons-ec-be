// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import findOneUserService from "../services/authService";

const isLoggedIn = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

      const currentUser = await findOneUserService(decodedData.payload.id);
      console.log(currentUser);
      const userObj = {
        id: currentUser.id,
        email: currentUser.email,
      };
      if (!currentUser) {
        res.status(401).json({
          status: 401,
          success: false,
          message: "User does not exist!",
        });
      } else {
        req.user = userObj;
        next();
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: `Error when authorizing user ${error.message}`,
      });
    }
  } else {
    res.status(401).json({
      status: 401,
      success: false,
      message: "Not logged in",
    });
  }
};

export const isSeller = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

    const currentUser = await findOneUserService(decodedData.payload.id);
    console.log(currentUser.role);
    if (currentUser.role === "seller") {
      next();
    } else {
      res.status(401).json({
        status: 401,
        success: false,
        message: "User is not a seller",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: `Error when authorizing user ${error.message}`,
    });
  }
};
export default isLoggedIn;
