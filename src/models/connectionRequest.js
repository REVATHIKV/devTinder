const mongoose = require("mongoose");
const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      ref:"User"
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      ref:"User"
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not a valid status ",
      },  
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
