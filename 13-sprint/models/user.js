const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Введите имя пользователя'],
    minlength: [2, 'Текст должен быть не короче 2 символов'],
    maxlength: [30, 'Текст должен быть короче 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Введите описание'],
    minlength: [2, 'Текст должен быть не короче 2 символов'],
    maxlength: [30, 'Текст должен быть короче 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Введите ссылку на аватар'],
  },
});

module.exports = mongoose.model('user', userSchema);
