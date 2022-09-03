const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError } = require('../constants/BadRequestError');
const { UnautorizedError } = require('../constants/UnautorizedError');
const { NotFoundError } = require('../constants/NotFoundError');
const { ConflictError } = require('../constants/ConflictError');
const {
  OK_CODE,
  CREATED_CODE,
} = require('../constants/codes');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send({ data: users }))
    .catch(next);
};

module.exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(OK_CODE).send({ data: user });
  } catch (error) {
    try {
      if (error.kind === 'ObjectId') {
        throw new BadRequestError('Неверный формат ID пользователя');
      }
    } catch (err) {
      next(err);
    }
    return next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(OK_CODE).send({ data: user });
  } catch (error) {
    try {
      if (error.kind === 'ObjectId') {
        throw new BadRequestError('Неверный формат ID пользователя');
      }
    } catch (err) {
      next(err);
    }
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CREATED_CODE).send({ data: user });
  } catch (error) {
    try {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные для создания пользователя');
      }
      if (error.code === 11000) {
        throw new ConflictError('Такой пользователь уже существует');
      }
    } catch (err) {
      next(err);
    }
    return next(error);
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }

    if (req.user._id !== user._id) {
      throw new ConflictError('Не достаточно прав для удаления');
    }

    return res.status(OK_CODE).send({ data: user });
  } catch (error) {
    try {
      if (error.kind === 'ObjectId') {
        throw new BadRequestError('Неверный формат ID пользователя');
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные для обновления пользователя');
      }
    } catch (err) {
      next(err);
    }
    return next(error);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }

    if (req.user._id !== user._id) {
      throw new ConflictError('Не достаточно прав для удаления');
    }

    return res.status(OK_CODE).send({ avatar: user.avatar });
  } catch (error) {
    try {
      if (error.kind === 'ObjectId') {
        throw new BadRequestError('Неверный формат ID пользователя');
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные для обновления пользователя');
      }
    } catch (err) {
      next(err);
    }
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnautorizedError('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnautorizedError('Неправильные почта или пароль');
    }

    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
    return res.status(OK_CODE).send({ token });
  } catch (error) {
    try {
      if (error.kind === 'ObjectId') {
        throw new BadRequestError('Неверный формат ID пользователя');
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные');
      }
    } catch (err) {
      next(err);
    }
    return next(error);
  }
};
