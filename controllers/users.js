const User = require('../models/user');
const {
  OK_CODE, CREATED_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE, DEFAULT_CODE,
} = require('../constants/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send({ data: users }))
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(OK_CODE).send({ data: user });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Неверный формат ID пользователя' });
    }
    return res.status(DEFAULT_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    return res.status(CREATED_CODE).send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Некорректные данные для создания пользователя' });
    }
    return res.status(DEFAULT_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateUserInfo = async (req, res) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(OK_CODE).send({ data: user });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Неверный формат ID пользователя' });
    }
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Некорректные данные для обновления пользователя' });
    }
    return res.status(DEFAULT_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
    }

    return res.status(OK_CODE).send({ avatar: user.avatar });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Неверный формат ID пользователя' });
    }
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Некорректные данные для обновления пользователя' });
    }
    return res.status(DEFAULT_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};
