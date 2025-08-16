const mongoose = require("mongoose");

const mongoDB_connectionString = process.env.MONGODB_CONNECTION_STRING;

const connectDB = async () => {
  await mongoose.connect(mongoDB_connectionString);
};

module.exports = connectDB;
