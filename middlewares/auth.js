const jwt = require('jsonwebtoken');
const { UnautorizedError } = require('../constants/errors');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
        throw new UnautorizedError('Необходима авторизация');
    }

    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;

  } catch (err) {
    next(err)
  }

  next();
}; 