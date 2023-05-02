const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const Joi = require('joi');

const chat = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required to create a contact'],
    },
    privat: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  },
  { versionKey: false, timestamps: true }
);

chat.post('save', handleMongooseError);

/**
 * Схема валидации добавления чата.
 */
const chatAddShema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'any.required': `"Name" is required`,
    'string.empty': `"Name" cannot be empty`,
    'string.base': `"Name" must be string`,
  }),

  privat: Joi.bool().default(false),
});

/**
 * Схема валидации обновления чата.
 */
const chatUpdateShema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'any.required': `"Name" is required`,
    'string.empty': `"Name" cannot be empty`,
    'string.base': `"Name" must be string`,
  }),

  privat: Joi.bool().default(false),

  members: Joi.array(),
}).min(1);

/**
 * Схема валидации обновления статуса чата.
 */
const statusUpdateShema = Joi.object({
  privat: Joi.boolean().required().messages({
    'any.required': 'Missing field favorite',
  }),
});

const chatsValidation = {
  chatAddShema,
  chatUpdateShema,
  statusUpdateShema,
};

const Chat = model('chat', chat);

module.exports = { Chat, chatsValidation };
