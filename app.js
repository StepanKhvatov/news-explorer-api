require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { limiter } = require('./utils/rateLimiter');
const { dataBaseSettings } = require('./utils/constants');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { signUpValidation, signInValidation } = require('./celebrateValidation/auth');
const NotFoundError = require('./errors/NotFoundError(404).js');

const { PORT = 3000, MONGODB_LINK } = process.env;

const users = require('./routes/users');
const articles = require('./routes/articles');

const auth = require('./middlewares/auth');

mongoose.connect(String(MONGODB_LINK), dataBaseSettings);

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);

app.post('/signup', signUpValidation, createUser);

app.post('/signin', signInValidation, login);

app.use(auth);

app.use(users);

app.use(articles);

app.use(errorLogger);

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => res.status(err.status || 500).send({ message: err.message }));

app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
});
