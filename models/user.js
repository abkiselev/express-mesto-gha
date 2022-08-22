const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    // validate: {
    //   validator(v) {
    //       return v >= 18;
    //   },
    //   message: 'Вам должно быть больше 18 лет!',
    // }
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('user', userSchema);