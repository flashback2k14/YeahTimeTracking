const { Client } = require("@notionhq/client");
const bcrypt = require("bcrypt");

require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

const checkAuth = (headers) => {
  if ("x-auth-token" in headers) {
    const authToken = headers["x-auth-token"];
    return authToken === process.env.AUTH_TOKEN;
  }

  return false;
};

const getDatabaseActiveId = () => {
  return process.env.NODE_ENV === "production"
    ? process.env.NOTION_DB_ACTIVE_ID
    : process.env.NOTION_DB_ACTIVE_ID_TEST;
};

const getDatabaseId = () => {
  return process.env.NODE_ENV === "production"
    ? process.env.NOTION_DB_ID
    : process.env.NOTION_DB_ID_TEST;
};

const createUuidV4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random % 4) + 8;
    return value.toString(16);
  });
};

const checkUser = async (headers) => {
  const _getUserFromHeader = (headers) => {
    const authHeader = headers["authorization"];
    const base64UserCred = authHeader.split(" ")[1];
    const userCred = Buffer.from(base64UserCred, "base64").toString();
    const username = userCred.split(":")[0];
    const pw = userCred.split(":")[1];
    return { username, pw };
  };

  const _getAllowedUsers = () => {
    const splittedUsers = process.env.USERS.split(" ");
    return splittedUsers
      .map((user) => user.split(":"))
      .map((splits) => ({ username: splits[0], pw: splits[1] }));
  };

  if (!("authorization" in headers)) {
    return false;
  }

  const requestedUser = _getUserFromHeader(headers);
  const allowedUsers = _getAllowedUsers();

  const foundAllowedUser = allowedUsers.find(
    (allowedUser) => allowedUser.username === requestedUser.username
  );
  if (!foundAllowedUser) {
    return false;
  }

  const match = await bcrypt.compare(requestedUser.pw, foundAllowedUser.pw);
  if (!match) {
    return false;
  }

  return true;
};

module.exports = {
  notion,
  checkAuth,
  createUuidV4,
  checkUser,
  getDatabaseId,
  getDatabaseActiveId,
};