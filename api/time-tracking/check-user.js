const { checkUser } = require("../../utils");
const { allowCors } = require("../../utils/cors");

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Not supported method" });
    return;
  }

  try {
    if (await checkUser(req.headers)) {
      res.json({ successful: true });
    } else {
      res.status(403).send({ message: "No valid user found" });
    }
  } catch (error) {
    res.status(400).send({ message: "failed" });
  }
};

module.exports = allowCors(handler);