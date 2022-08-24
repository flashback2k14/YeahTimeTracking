const { checkUser } = require("../../utils");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Not supported method" });
  }

  if (!checkUser(req.headers)) {
    res.status(403).send({ message: "No valid user found" });
  }

  res.json({ success: true });
};