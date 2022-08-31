const { history } = require("../../utils/operations");
const { allowCors } = require("../../utils/cors");
const { checkAuth } = require("../../utils");

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Not supported method" });
    return;
  }

  if (!checkAuth(req.headers)) {
    res.status(403).send({ message: "No valid auth" });
    return;
  }

  try {
    const historyTasks = await history();

    const simplyfiedTasks = historyTasks.map((task) => ({
      properties: task.properties,
      parent: task.parent,
    }));

    res.json({ historyTasks: simplyfiedTasks });
  } catch (error) {
    res.status(400).send({ message: "failed" });
  }
};

module.exports = allowCors(handler);