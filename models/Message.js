const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  receiverId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sentTime: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
