import Users from "../../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function userLogin(req, res) {
  try {
    let body = req.body;
    console.log(body);

    let email = body.email;
    let password = body.password;
    if (typeof password !== "string") {
      return res.json({ error: "Type of password must be String" });
    }

    console.log(email, password);

    const existingUser = await Users.findOne({
      email: email,
    });

    console.log(existingUser);

    if (!existingUser) {
      return res
        .status(400)
        .json({ status: "failed", message: "Incorrect email or password." });
    }

    console.log(typeof password);
    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "failed", message: "Incorrect email or password." });
    }

    const payload = {
      id: existingUser._id,
      role: existingUser.role,
      email: existingUser.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    return res.json({ status: "success", token });
  } catch (err) {
    console.log(err);
    return res.json({
      status: "failed",
      message: "Internal Server Error",
      err,
    });
  }
}

export default userLogin;
