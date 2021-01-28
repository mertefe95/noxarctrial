const express = require('express');

const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  const number = /^(?=.*\d)/;
  const letter = /^(?=.*[A-Z])/;

  if (!email || !username || !password) {
    return res
      .status(400)
      .send({ msg: 'Please fill all the necessary fields.' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).send({ msg: 'Please enter a valid email format.' });
  }

  if (!number.test(password)) {
    return res.status(400).send({
      msg: 'Please enter a password that is at least containing a number.',
    });
  }
  if (!letter.test(password)) {
    return res.status(400).send({
      msg: 'Please enter at least one uppercase letter in your password.',
    });
  }

  if (password.length < 6) {
    return res.status(400).send({
      msg: 'Please enter a password that is at least 6 or more characters.',
    });
  }

  try {
    const userExistsWithUsername = await User.findOne({ username });
    const userExistsWithEmail = await User.findOne({ email });

    if (userExistsWithEmail) {
      return res.status(400).send({
        msg:
          'An account has been created with this email previously. Please try a different email.',
      });
    }
    if (userExistsWithUsername) {
      return res.status(400).send({
        msg:
          'An account with this username exists. Please enter a different username.',
      });
    }

    const theSalt = await bcrypt.genSalt(9);

    const hashPassword = await bcrypt.hash(password, theSalt);

    const newRegisterUser = {
      username,
      email,
      password: hashPassword,
    };

    const user = new User(newRegisterUser);
    await user.save();

    return res.status(200).send({
      profile: { _id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ msg: 'Please enter your email' });
    }
    if (!password) {
      return res.status(400).send({ msg: 'Please enter your password.' });
    }

    const userLogin = await User.findOne({ email });

    if (!userLogin) {
      return res
        .status(400)
        .send({ msg: 'User with this email address does not exists. ' });
    }
    if (userLogin) {
      const passwordCompare = await bcrypt.compare(
        password,
        userLogin.password,
      );
      if (!passwordCompare) {
        return res.status(400).send({ msg: 'Wrong password.' });
      }
    }

    const token = await jwt.sign(
      { id: userLogin.id, email: userLogin.email },
      process.env.SECRET_KEY,
    );

    return res.status(200).send({
      profile: {
        _id: userLogin.id,
        username: userLogin.username,
        email: userLogin.email,
      },
      access_token: token,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

module.exports = router;
