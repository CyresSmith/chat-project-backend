const {
  getAll,
  getById,
  create,
  addMember,
  removeMember,
  updateStatus,
  remove,
} = require('./chatsController');

const {
  register,
  verify,
  reVerify,
  login,
  current,
  subscription,
  logout,
  updateAvatar,
} = require('./authController');

module.exports = {
  getAll,
  getById,
  create,
  addMember,
  removeMember,
  updateStatus,
  remove,
  register,
  verify,
  reVerify,
  login,
  current,
  subscription,
  logout,
  updateAvatar,
};
