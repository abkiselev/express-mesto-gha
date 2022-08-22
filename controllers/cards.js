const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.getCard = (req, res) => {
  console.log(req.params.cardId)
  Card.findById(req.params.cardId)
    .then(card => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  const createdAt = Date.now()

  Card.create({ name, link, owner, createdAt })
    .then(card => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}