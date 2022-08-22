const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.getUser = (req, res) => {
  console.log(req.params.userId)
  User.findById(req.params.userId)
    .then(user => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.createUser = (req, res) => {
  console.log(req.body)
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}