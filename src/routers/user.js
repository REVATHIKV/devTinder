const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { skipMiddlewareFunction } = require("mongoose");
const USER_STRING = "firstName lastName age skills about photoUrl gender";

const page = 1 ;
const limit = 2;


//get list of all pending/received requests - interested status
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const reqReceived = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName age gender skills about photoUrl");

    res.json({ message: "list of all pending requests", reqReceived });
  } catch (err) {
    res.status(400).json({ message: "ERROR : " + err });
  }
});

//VIEW ALL CONNECTIONS

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id ,status: "accepted"}, { toUserId: loggedInUser._id ,status: "accepted"}],
      })
      .populate("fromUserId", USER_STRING)
      .populate("toUserId", USER_STRING);

    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "Connections listed below", data });
  } catch (err) {
    res.status(400).json({ message: "ERROR : " + err });
  }
});

//FEED api - list of all users

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    let page = req.query.page ;
    let limit = 30 ;
    let skip = (page-1)*limit ;

    const loggedInUser = req.user;
    const connections = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hideConnections = new Set();

    connections.forEach((user) => {
      hideConnections
        .add(user.fromUserId.toString())
        .add(user.toUserId.toString());
    });

    const feedList = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideConnections) },
        },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_STRING).skip(skip).limit(limit);

    res.json({ message: "List od usres", feedList });
  } catch (err) {
    res.status(400).json({ message: "ERROR : " + err });
  }
});

module.exports = userRouter;
