const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError(401)');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, `${JWT_SECRET}`);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация'); // Ошибка 401
  }

  req.user = payload;

  next();
};
