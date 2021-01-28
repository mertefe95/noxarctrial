const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send({ msg: 'Please enter your username.' });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .send({ msg: 'User with this username does not exist.' });
  }

  return res.status(200).send({
    _id: user.id,
    username: user.username,
    email: user.email,
  });
});

router.get('/search', async (req, res) => {
  const users = await User.find({}, { password: 0, __v: 0 });

  if (!users) {
    return res.status(400).send({ msg: 'User not found.' });
  }

  const data = users;

  return res.status(200).send({ data });
});

module.exports = router;
