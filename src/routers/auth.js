const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignup } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, emailId, password, age, gender, photoUrl } =
      req.body;

    const data = await User.findOne({ emailId: emailId });
    if (data) {
      throw new Error(
        "Duplicate entry!! please check if the user is already registered or not"
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
    });

    validateSignup(req.body);
   

     const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });



    res.json({message:"User added successfully",data:savedUser});
  } catch (err) {
    res.status(400).json({message:"" + err,data:''});
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Enter credentials to login");
    }

    if (!validator.isEmail(emailId)) {
      throw new Error("Enter a valid Email Id");
    }
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.isPasswordValid(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.json({ message: "User logged in Successfully!!", data: user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("" + err);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });

  res.send("Logged out successfully !!");
});

module.exports = authRouter;
