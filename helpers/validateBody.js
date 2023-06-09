const HttpError = require('./httpError');

/**
 * Функция валидации данных контакта.
 */
const validateBody = shema => {
  const func = async (req, res, next) => {
    const { error } = shema.validate(req.body);

    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = validateBody;
