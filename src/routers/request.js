const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
 

requestRouter.post(
  "/send/request/:status/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const user = req.user;

      const fromUserId = user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const ISALLOWED = ["ignored", "interested"];

      if (!ISALLOWED.includes(status)) {
        return res.status(400).send("Invalid status type !!");
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).send("User not found !!");
      }

      const requestExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      console.log(requestExists);

      if (requestExists) {
        return res.status(400).send("ERROR : " + "Request already exists !!");
      }

      const sendRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await sendRequest.save();

      res.json({
        message: user.firstName + " " + status + " " + toUser.firstName,
        data: data,
      });

      //res.send("Connection request sent by " + user.firstName) ;
    } catch (err) {
      res.status(400).send("ERROR : " + err);
    }
  }
);

requestRouter.post(
  "/send/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      const user = req.user;

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      const validRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: user._id,
      });

      if (!validRequest) {
        return res.status(404).json({ message: "Request not found !!" });
      }

      validRequest.status = status;
      const data = await validRequest.save();

      res.json({ message: "The selected request has been " + status, data });
    } catch (err) {
      res.status(400).send("ERROR : " + err);
    }
  }
);

module.exports = requestRouter;
