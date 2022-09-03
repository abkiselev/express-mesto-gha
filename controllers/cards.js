const Card = require('../models/card');
const {
  OK_CODE,
  CREATED_CODE,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require('../constants/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = async (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED_CODE).send({ data: card });

  } catch (error) {
    try {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные для создания карточки');
      }
    } catch (error) {
      next(error)
    }
    next(error)
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    const owner = req.user._id;
    
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }

    if(req.user._id !== owner){
      throw new ConflictError('Не достаточно прав для удаления');
    }

    return res.status(OK_CODE).send({ data: card });

  } catch (error) {
    try {
      if (error.kind === 'ObjectId') {
        throw new BadRequestError('Неверный формат ID');
      }
    } catch (error) {
      next(error)
    }
    next(error)
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    return res.status(OK_CODE).send({ data: card });

  } catch (error) {
    try {
      if (error.kind === 'ObjectId') {
        throw new BadRequestError('Неверный формат ID');
      }
    } catch (error) {
      next(error)
    }
    next(error)
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    return res.status(OK_CODE).send({ data: card });

  } catch (error) {
    try {
      if (error.kind === 'ObjectId') {
        throw new BadRequestError('Неверный формат ID');
      }
    } catch (error) {
      next(error)
    }
    next(error)
  }
};
