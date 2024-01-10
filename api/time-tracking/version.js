const { allowCors } = require("../../utils/cors");
const { version } = require("../../package.json");

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Not supported method" });
    return;
  }

  try {
    res.json({ version });
  } catch (error) {
    res.status(400).send({ message: "failed" });
  }
};

module.exports = allowCors(handler);
