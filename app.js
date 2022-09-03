const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { NotFoundError } = require('./constants/codes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);
app.post('/signin', login);
app.post('/signup', createUser);
app.use('*', () => {
  throw new NotFoundError('Недопустимый URL');
});

app.use((err, res) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log('Ошибка при запуске', ...err);
  }
  console.log(`Сервер запущен на порту ${PORT}`);
});
