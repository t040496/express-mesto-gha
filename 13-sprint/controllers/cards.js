const { ValidationError } = require('mongoose').Error;
const cardModel = require('../models/card');
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('../utils/constants');

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка»',
      });
    });
};

const createCard = (req, res) => {
  cardModel
    .create({ owner: req.user._id, ...req.body })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: 'Некорректные данные для создания карточки',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка»',
      });
    });
};

const deleteCardById = (req, res) => {
  cardModel
    .findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then(() => {
      res.status(200).send({ message: 'Карточка удалёна' });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка не найдена' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка»',
      });
    });
};

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка не найдена' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка»',
      });
    });
};

const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка не найдена' });
      } return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка»',
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
