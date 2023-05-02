const express = require('express');
const router = express.Router();

const { isValidId, authentication } = require('../middlewares');
const { validateBody } = require('../helpers');
const ctrl = require('../controller');
const { chatsValidation } = require('../schemas');

const { chatAddShema, statusUpdateShema } = chatsValidation;

router.get('/', authentication, ctrl.getAll);

router.get('/:_id', authentication, isValidId, ctrl.getById);

router.post('/', authentication, validateBody(chatAddShema), ctrl.create);

router.patch('/:_id/add', authentication, isValidId, isValidId, ctrl.addMember);

router.patch(
  '/:_id/remove',
  authentication,
  isValidId,
  isValidId,
  ctrl.removeMember
);

router.patch(
  '/:_id/privat',
  authentication,
  isValidId,
  validateBody(statusUpdateShema),
  ctrl.updateStatus
);

router.delete('/:_id', authentication, isValidId, ctrl.remove);

module.exports = router;
