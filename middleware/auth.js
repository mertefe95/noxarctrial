const jwt = require('jsonwebtoken');
require('dotenv').config({
  path: `${__dirname}/../.env`,
});

const auth = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) {
      return res
        .status(401)
        .send({ msg: 'Token not found. Authorization has been denied.' });
    }

    const isVerified = jwt.verify(token, process.env.SECRET_KEY);
    if (!isVerified) {
      return res.status(400).send({
        msg: 'Unsuccesful token verification. Authentication denied.',
      });
    }

    req.user = isVerified.id;

    next();
    
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = auth;
