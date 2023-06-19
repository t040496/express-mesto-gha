const { ValidationError, DocumentNotFoundError } = require('mongoose').Error;

const userModel = require('../models/user');
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('../utils/constants');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const getUserById = (req, res) => {
  userModel
    .findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь не найден' });
      } return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: 'Некорректные данные для создания пользователя',
        });
      } return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const updateUser = (req, res) => {
  userModel
    .findOneAndUpdate(
      { _id: req.user._id },
      { ...req.body },
      {
        runValidators: true,
        new: true,
      },
    )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь не найден' });
      } if (err instanceof ValidationError) {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: 'Некорректные данные для обновления пользователя' });
      } return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
};
