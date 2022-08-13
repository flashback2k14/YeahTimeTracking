const { checkAuth } = require('../../utils');
const { findActiveTasks } = require('../../utils/operations');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Not supported method' });
  }

  if (!checkAuth(req.headers)) {
    res.status(403).send({ message: 'No valid auth' });
  }

  try {
    const foundActiveTaskPages = await findActiveTasks();
    const types = foundActiveTaskPages?.map(page => page.properties['Type']?.rich_text[0]?.plain_text ?? -1) ?? [];
    res.json({ types });
  } catch (error) {
    res.status(400).send({ message: 'failed' });
  }
};
