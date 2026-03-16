import Users from "../../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function myAuth(req, res) {
  try {
    let loggedInUser = req.authMiddleware;
    console.log(loggedInUser);

    return res.json({ status: "success", user: loggedInUser });
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failed",
      message: "Internal Server Error",
      err,
    });
  }
}

export default myAuth;
