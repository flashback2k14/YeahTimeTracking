const { Client } = require('@notionhq/client');

require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

const checkAuth = (headers) => {
  if ('x-auth-token' in headers) {
    const authToken = headers['x-auth-token'];
    return authToken === process.env.AUTH_TOKEN;
  }

  return false;
};

const getDatabaseId = () => {
  return process.env.NODE_ENV === 'production' ? process.env.NOTION_DB_ID : process.env.NOTION_DB_ID_TEST;
};

const createUuidV4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random % 4) + 8;
    return value.toString(16);
  });
};

module.exports = {
  notion,
  checkAuth,
  getDatabaseId,
  createUuidV4,
};
