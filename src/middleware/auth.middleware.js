import ApiResponse from "../utils/api_response/api_response.js";
import ApiError from "../utils/api_response/api_error.js";
import jwt from "jsonwebtoken";

const IsUserLoggedIn = async (req, res, next) => {
  // steps
  //   1 . is token availabe
  // 2. if token is valid
  //   3.validate token

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      const response = new ApiResponse(401, "Unauthenticated");
      return res.status(response.statusCode).json(response);
    }

    let verifyToken;
    try {
      verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const response = new ApiResponse(401, `Unauthorized: ${error.message}`);
      return res.status(response.statusCode).json(response);
    }
    req.user = verifyToken;
    next();
  } catch (error) {
    throw new ApiError(
      417,
      `Server refused to process your request ${error.message}`
    );
  }
};

export default IsUserLoggedIn;
