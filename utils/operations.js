const { notion, getDatabaseActiveId, getDatabaseId } = require('../utils');

const findActiveTask = async (taskType) => {
  const { results } = await notion.databases.query({
    database_id: getDatabaseActiveId(),
    filter: {
      property: 'Type',
      text: {
        contains: taskType,
      },
    },
    sorts: [
      {
        property: 'Type',
        direction: 'ascending',
      },
    ],
  });

  return results;
};

const createActiveEntry = async (uuid, taskType) => {
  await notion.pages.create({
    parent: {
      database_id: getDatabaseActiveId(),
    },
    properties: {
      ID: {
        title: [
          {
            type: 'text',
            text: {
              content: uuid,
            },
          },
        ],
      },
      Type: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: taskType,
            },
          },
        ],
      },
    },
  });
};

const createEntry = async (uuid, taskType) => {
  return notion.pages.create({
    parent: {
      database_id: getDatabaseId(),
    },
    properties: {
      ID: {
        title: [
          {
            type: 'text',
            text: {
              content: uuid,
            },
          },
        ],
      },
      Type: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: taskType,
            },
          },
        ],
      },
      State: {
        select: {
          name: 'Running',
        },
      },
    },
  });
};

const deleteActiveEntry = async (id) => {
  await notion.blocks.delete({
    block_id: id,
  });
};

const updateEntryState = async (id) => {
  await notion.pages.update({
    page_id: id,
    properties: {
      State: {
        select: {
          name: 'Finished',
        },
      },
    },
  });
};

module.exports = {
  createEntry,
  findActiveTask,
  updateEntryState,
  createActiveEntry,
  deleteActiveEntry,
};
