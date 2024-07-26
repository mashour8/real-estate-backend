import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  //to do

  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    res.status(201).json({ message: "User has been created successfuly" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Failed to create user` });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    //check if the user is exists!
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

    //check if the password is correct!
    const isPasswordVaild = await bcrypt.compare(password, user.password);
    if (!isPasswordVaild)
      return res.status(401).json({ message: "Invalid Credentials!" });

    // genrate token!
    const cookieExp = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: cookieExp }
    );
    const { password: userPassword, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: cookieExp,
      })
      .status(200)
      // .json({ message: "Login Successful" });
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Failed to login error:  ${err}` });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
