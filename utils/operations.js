const { notion, getDatabaseActiveId, getDatabaseId } = require("../utils");

const findActiveTask = async (taskType) => {
  const { results } = await notion.databases.query({
    database_id: getDatabaseActiveId(),
    filter: {
      property: "Type",
      rich_text: {
        contains: taskType,
      },
    },
    sorts: [
      {
        property: "Type",
        direction: "ascending",
      },
    ],
  });

  return results;
};

const findActiveTasks = async () => {
  const { results } = await notion.databases.query({
    database_id: getDatabaseActiveId(),
    sorts: [
      {
        property: "Type",
        direction: "ascending",
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
            type: "text",
            text: {
              content: uuid,
            },
          },
        ],
      },
      Type: {
        rich_text: [
          {
            type: "text",
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
            type: "text",
            text: {
              content: uuid,
            },
          },
        ],
      },
      Type: {
        rich_text: [
          {
            type: "text",
            text: {
              content: taskType,
            },
          },
        ],
      },
      State: {
        select: {
          name: "Running",
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
          name: "Finished",
        },
      },
    },
  });
};

const history = async () => {
  let hasMore = false;
  let nextCursor = undefined;
  const result = [];

  do {
    const response = await notion.databases.query({
      database_id: getDatabaseId(),
      sorts: [
        {
          property: "Modified",
          direction: "descending",
        },
      ],
      start_cursor: nextCursor,
    });

    result.push(...response.results);
    hasMore = response.has_more;
    nextCursor = response.next_cursor;
  } while (hasMore);

  return result;
};

const historyPaged = async (cursor) => {
  const response = await notion.databases.query({
    database_id: getDatabaseId(),
    sorts: [
      {
        property: "Modified",
        direction: "descending",
      },
    ],
    start_cursor: cursor,
  });

  return ({ results, next_cursor } = response);
};

const getPropertyValue = async (pageId, propertyId) => {
  const { results } = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: propertyId,
  });
  return results;
};

module.exports = {
  createEntry,
  findActiveTask,
  findActiveTasks,
  updateEntryState,
  createActiveEntry,
  deleteActiveEntry,
  history,
  historyPaged,
  getPropertyValue,
};
