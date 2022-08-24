const { checkAuth } = require('../../utils');
const { findActiveTasks } = require('../../utils/operations');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Not supported method' });
    return;
  }

  if (!checkAuth(req.headers)) {
    res.status(403).send({ message: 'No valid auth' });
    return;
  }

  try {
    const foundActiveTaskPages = await findActiveTasks();
    const tasks = foundActiveTaskPages?.map((page) => page.properties['Type']?.rich_text[0]?.plain_text ?? -1) ?? [];
    res.json({ active_tasks: tasks });
  } catch (error) {
    res.status(400).send({ message: 'failed' });
  }
};
