import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/Users.js";

const secretkey = process.env.JWT_SECRET_KEY;

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: "failed", message: "Auth Token Missing" });
    }

    let decodedValue = jwt.verify(token, secretkey);

    const existingUser = await User.findById(decodedValue.id);

    req.authMiddleware = existingUser;

    next();
  } catch (error) {
    console.log(error);
    return res.json({
      status: "failed",
      message: "Internal Server Error",
      error,
    });
  }
}
export default authMiddleware;
