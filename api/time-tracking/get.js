const { checkAuth } = require('../../utils');
const {
  findActiveTask,
  createActiveEntry,
  createEntry,
  deleteActiveEntry,
  updateEntryState,
} = require('../../utils/operations');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Not supported method' });
  }

  if (!checkAuth(req.headers)) {
    res.status(403).send({ message: 'No valid auth' });
  }

  try {
    const foundActiveTaskPages = null;
    
    
    
  } catch (error) {
    res.status(400).send({ message: 'failed' });
  }

  res.status(201).send({ message: 'successful' });
};
