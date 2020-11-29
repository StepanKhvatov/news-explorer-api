const users = require('express').Router();

const {
  getUser,
} = require('../controllers/users');

users.get('/users/me', getUser); // возвращает информацию о пользователе (email и имя)

module.exports = users;
