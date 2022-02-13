const { notion, checkAuth, getDatabaseId, createUuidV4 } = require('../../utils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Not supported method' });
  }

  if (!checkAuth(req.headers)) {
    res.status(403).send({ message: 'No valid auth' });
  }

  await notion.pages
    .create({
      parent: {
        database_id: getDatabaseId(),
      },
      properties: {
        ID: {
          title: [
            {
              type: 'text',
              text: {
                content: createUuidV4(),
              },
            },
          ],
        },
        Type: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: req.body.type,
              },
            },
          ],
        },
      },
    })
    .catch((error) => {
      res.status(400).send({ message: 'failed' });
    });

  res.status(201).send({ message: 'successful' });
};
