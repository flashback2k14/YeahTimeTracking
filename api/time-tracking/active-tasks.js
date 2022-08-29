const { checkAuth } = require('../../utils');
const { findActiveTasks, getPropertyValue } = require('../../utils/operations');

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
    const tasks =
      (await Promise.all(
        foundActiveTaskPages?.map(async (page) => {
          const propertyValue = await getPropertyValue(page.id, page.properties['Type'].id);
          return propertyValue[0]?.rich_text?.plain_text ?? -1;
        })
      )) ?? [];
    res.json({ active_tasks: tasks });
  } catch (error) {
    res.status(400).send({ message: 'failed' });
  }
};
