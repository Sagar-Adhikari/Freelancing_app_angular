const _ = require('lodash');

const isUserMemberOfRoom = async (client, userId, roomId) => {

  const result = await client.query(`SELECT COUNT(1) FROM chatroom_chatroom WHERE user_id = '${userId}' and id = '${roomId}'`);
  if (result.rows[0].count > 0) {
    return true;
  }

  const userEmailQuery = await client.query(`SELECT email FROM users_user WHERE id = '${userId}'`);
  if (_.isEmpty(userEmailQuery.rows)) {

    return false;
  }

  const roomQuery  = await client.query(`SELECT COUNT(1) FROM chatroom_chatroom WHERE invite_users = '${userEmailQuery.rows[0].email}' and id = '${roomId}'`);
  return roomQuery.rows[0].count > 0;
};

const getOtherMemberUserIdOfRoom = async (client, roomId, userId) => {

  const result = await client.query(`SELECT user_id, invite_users from chatroom_chatroom WHERE id = '${roomId}'`);
  if (_.isEmpty(result.rows)) {
    return;
  }

  const userIdFromRow = result.rows[0].user_id;
  if (userIdFromRow != userId) {
    return userIdFromRow;
  }

  const userQuery = await client.query(`SELECT id FROM users_user WHERE email = '${result.rows[0].invite_users}' and is_active = true`);
  if (_.isEmpty(userQuery.rows)) {
    return;
  }

  return userQuery.rows[0].id;
}

const isUserConnected = async (io, userId) => {

  return _.some(io.sockets.sockets, {userId: userId});
}

module.exports = {
  isUserMemberOfRoom,
  getOtherMemberUserIdOfRoom,
  isUserConnected,
}