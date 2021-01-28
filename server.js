const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AuthRoute = require('./routes/AuthRoute');
const UserRoute = require('./routes/UserRoute');
const MessageRoute = require('./routes/MessageRoute');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/message', MessageRoute);

const PORT = process.env.PORT || 8080;
const { connection } = mongoose;

connection.once('open', () => {
  console.log('MongoDB Connection has been established.');
});

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`${PORT} is running on.`);
});
