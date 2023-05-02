const { Chat } = require('../schemas');
const { httpError, ctrlWrapper } = require('../helpers');

/**
 * ============================ Получение всех чатов
 */
const getAllChats = async (req, res) => {
  const { _id } = req.user;

  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const result = await Chat.find({ members: _id }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner members', 'name');

  if (!result) {
    throw httpError(404, 'Chats not found');
  }

  res.status(200).json(result);
};

/**
 * ============================ Получение чата по ID
 */
const getChatById = async (req, res) => {
  const { _id } = req.params;

  const result = await Chat.findById(_id).populate('owner members', 'name');

  if (!result) {
    throw httpError(404, `Chat with id ${_id} Not found`);
  }

  res.status(200).json(result);
};

/**
 * ============================ Создание чата
 */
const createChat = async (req, res) => {
  const { _id } = req.user;
  const result = await Chat.create({
    ...req.body,
    owner: _id,
    members: [_id],
  });
  res.status(201).json(result);
};

/**
 * ============================ Добавление участника в чат
 */
const addChatMember = async (req, res) => {
  const { _id } = req.params;
  const { _id: userId } = req.body;

  const result = await Chat.findOneAndUpdate(
    { _id },
    { $push: { members: userId } },
    { safe: true, upsert: true, new: true }
  );

  if (!result) {
    throw httpError(404, `Chat with id ${_id} not found`);
  }

  return res.status(200).json(result);
};

/**
 * ============================ Удаление участника из чата
 */
const removeChatMember = async (req, res) => {
  const { _id } = req.params;
  const { _id: userId } = req.body;

  const result = await Chat.findOneAndUpdate(
    { _id },
    { $pull: { members: userId } },
    { safe: true, upsert: true, new: true }
  );

  if (!result) {
    throw httpError(404, `Chat with id ${_id} not found`);
  }

  return res.status(200).json(result);
};

/**
 * ============================ Обновление статуса чтата
 */
const updateStatus = async (req, res) => {
  const { _id } = req.params;

  const result = await Chat.findByIdAndUpdate(_id, req.body);

  if (!result) {
    throw httpError(404, `Chat with id ${_id} not found`);
  }

  const message = () => {
    if (req.body.privat) {
      return { message: `Chat with id: ${_id} became private` };
    }

    return { message: `Chat with id: ${_id} became public` };
  };

  return res.status(200).json(message());
};

/**
 * ============================ Удаление чтата
 */
const removeChat = async (req, res) => {
  const { _id } = req.params;

  const removed = await Chat.findByIdAndRemove(_id);

  if (!removed) {
    throw httpError(404, `Chat with id ${_id} not found`);
  }

  res.status(200).json({ message: 'Chat successfully removed' });
};

module.exports = {
  getAll: ctrlWrapper(getAllChats),
  getById: ctrlWrapper(getChatById),
  create: ctrlWrapper(createChat),
  addMember: ctrlWrapper(addChatMember),
  removeMember: ctrlWrapper(removeChatMember),
  updateStatus: ctrlWrapper(updateStatus),
  remove: ctrlWrapper(removeChat),
};
