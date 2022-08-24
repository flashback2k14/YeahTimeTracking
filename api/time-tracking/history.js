const { checkAuth } = require("../../utils");
const { history } = require("../../utils/operations");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Not supported method" });
  }

  if (!checkAuth(req.headers)) {
    res.status(403).send({ message: "No valid auth" });
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