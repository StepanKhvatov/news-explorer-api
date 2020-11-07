const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError(404)');
const ConflictError = require('../errors/ConflictError(409)');
const UnauthorizedError = require('../errors/UnauthorizedError(401)');

const { JWT_SECRET = 'secret-key' } = process.env;

const getUser = (req, res, next) => { // должен возвращать email and name
  UserSchema.findById(req.user._id)
    .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); })
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  return UserSchema.findOne({ email })
    .then((sameUser) => {
      if (sameUser) {
        throw new ConflictError('Пользователь с таким email уже есть');
      }

      return bcrypt.hash(password, 10)
        .then((hash) => UserSchema.create({
          name,
          email,
          password: hash,
        }))
        .then((user) => {
          res.send({
            data: {
              name: user.name,
              email: user.email,
            },
          });
        })
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${JWT_SECRET}`, { expiresIn: '7d' });
      try {
        res.send({ token });
      } catch (error) {
        throw UnauthorizedError('Необходима авторизация');
      }
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  login,
};
