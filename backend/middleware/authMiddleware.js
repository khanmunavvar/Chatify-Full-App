import jwt from "jsonwebtoken";
import User from "../models/User.js"; 
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check token comes with Bearer or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // remove bearer and fetch token
      token = req.headers.authorization.split(" ")[1];

      // verify Token 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find user and it's all detail's expect password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
// if token not received throw an error
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };