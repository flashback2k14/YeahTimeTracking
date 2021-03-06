const { checkAuth, createUuidV4 } = require('../../utils');
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

  const taskType = req.body.type;

  // check active table if task type is inside
  // no?
  //  --> add to active table
  //  --> add to table and set state to running
  // yes?
  //  --> remove from active table
  //  --> set state to finished

  try {
    const foundActiveTaskPages = await findActiveTask(taskType);

    if ((foundActiveTaskPages?.length ?? 0) === 0) {
      const { id } = await createEntry(createUuidV4(), taskType);
      await createActiveEntry(id, taskType);
    } else {
      const foundActiveTaskPage = foundActiveTaskPages[0];
      const pageId = foundActiveTaskPage.properties['ID']?.title[0]?.plain_text ?? -1;
      if (pageId === -1) {
        res.status(404).send({ message: 'invalid page id' });
      }
      await deleteActiveEntry(foundActiveTaskPage.id);
      await updateEntryState(pageId);
    }
  } catch (error) {
    res.status(400).send({ message: 'failed' });
  }

  res.status(201).send({ message: 'successful' });
};
