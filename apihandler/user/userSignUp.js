import Users from "../../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function userSignUp(req, res) {
  try {
    let body = req.body;
    console.log(body);

    let name = body.name;
    let email = body.email;
    let password = body.password;
    let role = body.role;
    let phone = body.phone;

    console.log(email, name, password, role, phone);

    const user = await Users.find({ email: email });
    if (user.length>0)
      res.json({
        status: "failed",
        message: "already existing email ID",
      });

    let ROUNDS= 5
    let passwordHash = await bcrypt.hash(password,ROUNDS)

    const newUser = new Users({
      // _id: new ObjectId,
      email: email,
      name: name,
      passwordHash: passwordHash,
      role: role,
      phone: phone,
    });
    await newUser.save();

    const payload = { id: newUser._id, role: newUser.role, email: newUser.email };
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
    );

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

export default userSignUp;
