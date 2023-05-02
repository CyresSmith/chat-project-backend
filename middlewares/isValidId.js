const { isValidObjectId } = require('mongoose');

const { httpError } = require('../helpers');

const isValidId = (req, res, next) => {
  const { _id } = req.params;
  if (!isValidObjectId(_id)) {
    next(httpError(404, `${_id} invalid format`));
  }

  next();
};

module.exports = isValidId;
