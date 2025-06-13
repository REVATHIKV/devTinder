const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {

     
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedMessage = await jwt.verify(token, "devTinder@123");

    if (!decodedMessage) {
      throw new Error("Token expired. Login again");
    }

    const { _id } = decodedMessage;

    const user = await User.findById({ _id });

    //console.log(user.firstName);

    if (!user) {
      throw new Error("User does not exists");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
};

module.exports = { userAuth };
