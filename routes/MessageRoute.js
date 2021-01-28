const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');

const router = express.Router();
const auth = require('../middleware/auth');

router.post('/send', auth, async (req, res) => {
  const { user, text } = req.body;
  const senderId = req.user;

  if (!user) {
    return res.status(400).send({ msg: 'Please fill the user id information' });
  }
  if (!text) {
    return res.status(400).send({ msg: 'Please enter the message text.' });
  }

  const messagedUser = await User.findById(user);

  if (!messagedUser) {
    return res
      .status(400)
      .send({ msg: 'The user you want to send message does not exist.' });
  }
  const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  const newMessage = {
    receiverId: user,
    text,
    sentTime: date,
    senderId,
  };

  const sentMessage = new Message(newMessage);
  await sentMessage.save();

  return res.status(200).send({
    text,
    user: {
      _id: messagedUser.id,
      username: messagedUser.username,
      email: messagedUser.email,
    },
    sent: sentMessage.sentTime,
  });
});

router.get('/with_user', auth, async (req, res) => {
  const { user } = req.body;
  const userId = req.user;

  if (!user) {
    return res
      .status(400)
      .send({ msg: 'Please enter required user id information.' });
  }

  const sentMessages = await Message.find(
    { receiverId: user, senderId: userId },
    { __v: 0 },
  );

  if (!sentMessages) {
    return res
      .status(400)
      .send({ msg: 'No message exists between you and that user.' });
  }

  const receivedMessages = await Message.find(
    { receiverId: userId, senderId: user },
    { __v: 0 },
  );

  if (!receivedMessages) {
    return res.status(400).send({ msg: 'Message not existing as sender.' });
  }

  return res.status(200).send({
    messages: [...sentMessages, ...receivedMessages],
  });
});

router.get('/with_user_detailed', auth, async (req, res) => {
  const { user } = req.body;
  const userId = req.user;

  if (!user) {
    return res
      .status(400)
      .send({ msg: 'Please enter required user id information.' });
  }

  const sentMessages = await Message.find(
    { receiverId: user, senderId: userId },
    { __v: 0 },
  );

  if (!sentMessages) {
    return res
      .status(400)
      .send({ msg: 'No message exists between you and that user.' });
  }

  const receivedMessages = await Message.find(
    { receiverId: userId, senderId: user },
    { __v: 0 },
  );

  if (!receivedMessages) {
    return res.status(400).send({ msg: 'Message not existing as sender.' });
  }

  return res.status(200).send({
    messages: {
      sentMessages,
      receivedMessages,
    },
  });
});


module.exports = router;
