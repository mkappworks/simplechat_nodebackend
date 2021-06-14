const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema(
  {
    isMy: Boolean,
    message: String,
    createdAt: Date,
  }
);

const receiverSchema = new Schema({
  _id: String,
  messages: [contentSchema],
});

const messageSchema = new Schema({
  _id: String,
  users: [receiverSchema],
});

module.exports = mongoose.model("Message", messageSchema);
