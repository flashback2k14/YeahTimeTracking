const { checkAuth, createUuidV4 } = require("../../utils");
const { allowCors } = require("../../utils/cors");
const {
  findActiveTask,
  createActiveEntry,
  createEntry,
  deleteActiveEntry,
  updateEntryState,
  getPropertyValue,
} = require("../../utils/operations");

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Not supported method" });
    return;
  }

  if (!checkAuth(req.headers)) {
    res.status(403).send({ message: "No valid auth" });
    return;
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
      const propertyValue = await getPropertyValue(
        foundActiveTaskPage.id,
        foundActiveTaskPage.properties["ID"].id
      );
      const pageId = propertyValue[0]?.title?.plain_text ?? -1;
      if (pageId === -1) {
        res.status(404).send({ message: "invalid page id" });
        return;
      }
      await deleteActiveEntry(foundActiveTaskPage.id);
      await updateEntryState(pageId);
    }

    res.status(201).send({ message: "successful" });
  } catch (error) {
    res.status(400).send({ message: "failed" });
  }
};

module.exports = allowCors(handler);