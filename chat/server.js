const { RedisError } = require('redis');
const _ = require('lodash');
const { getOtherMemberUserIdOfRoom, isUserConnected } = require('./helpers');

var app = require('express')();
http = require('http').Server(app);
io = require('socket.io')(http);
Client = require('node-rest-client').Client;
redis = require('redis');

const DATABASE_URL = '127.0.0.1';
const DATABASE_PORT = 5432;
const REDIS_URL = '127.0.0.1';
const REDIS_PORT = 6379;
const API_URL = 'http://127.0.0.1:8000';

const { Pool } = require('node-postgres');
const pool = new Pool({
  user: 'root',
  host: DATABASE_URL,
  database: 'network_plus',
  password: 'thepeeps',
  port: DATABASE_PORT,
});
var dbClient;

(async () => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  dbClient = await pool.connect()
  try {
    await dbClient.query('BEGIN')
    const ret = await dbClient.query(`SELECT COUNT(1) FROM users_user`);
    await dbClient.query('COMMIT');
  } catch (e) {
    await dbClient.query('ROLLBACK')
    throw e
  }
})().catch(console.error);


redisClient = redis.createClient(REDIS_PORT ,REDIS_URL);
//redis.createClient(port[, host][, options])

const REDIS_READY = 'ready';
const REDIS_CONNECT = 'connect';
const REDIS_RECONNECTING = 'reconnecting';
const REDIS_ERROR = 'error';
const REDIS_END = 'end';
const REDIS_WARNING = 'warning';

redisClient.on(REDIS_READY, () => {
    console.log('Redis: ready');
});

redisClient.on(REDIS_CONNECT, () => {
    console.log('Redis: connected');
});

redisClient.on(REDIS_RECONNECTING, () => {
    console.log('Redis: re-connecting');
});

redisClient.on(REDIS_ERROR, (error) => {
    console.error('Redis Error. Event: ' + REDIS_ERROR + ' ' + error);
});

redisClient.on(REDIS_END, () => {
    console.log('Redis: end');
});

redisClient.on(REDIS_WARNING, (warning) => {
    console.log('Redis: warning: ' + warning);
});


io.use((socket, next) => {

    try {

        const jwt_token = _.isNil(socket.handshake.query.token) ? '' : socket.handshake.query.token;
        const current_user = _.isNil(socket.handshake.query.user_id) ? '' : socket.handshake.query.user_id;
        
        if (jwt_token == null || _.isNil(jwt_token)) {
            next(new Error('Invalid token'));
            return;
        }

        ///  check if token exist in Redis and attach real user id
        redisClient.sismember(current_user, jwt_token, function(err, reply) {
            if (err){
                next(new Error('No user found'));
                return;
            }
            if (reply == 1){
                socket.userId = current_user
                next();
                return;
            }
          });
        // socket.userId = dummyUserId;

        
    } catch (error) {
        console.error(error);
        next(new Error('Failed'));
    }
});

io.on('connection', (socket) => {

    // Log whenever a user connects
    console.log('user connected');

    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('remote nepal join room', function(room) {
        socket.room_name = room;
        socket.join(room);
    });

    socket.on('remote nepal message', (data) => {

        console.log(data.file_ids.toString());
        console.log(data.file_ids.length);

        var client = new Client();
        var args = {
            data: { user: data.user_id, room: data.room_id, chat_message: data.message, file: JSON.stringify(data.file_ids), message: JSON.stringify(data.qte) },
            headers: { "Content-Type": "application/json", "Authorization": data.hrs },
            requesConfig: { timeout: 1000 },
            responseConfig: { timeout: 9000 }
        };
        var req1 = client.post(API_URL+'/api/chat/message/', args, async (resdata, response) => {

            io.to(socket.room_name).emit('remote nepal message', { type: 'chat', user_id: data.user_id, message: data.message, current_date_time: data.current_date_time, roomno: data.roomno, hrs: data.hrs, room_id: data.room_id, file_ids: data.file_ids, file_info: data.file_info, msg_id: resdata.id, qte: data.qte, message_info: data.message_info });
            const otherMemberUserId = await getOtherMemberUserIdOfRoom(dbClient, data.room_id, socket.userId);
            if (!_.isNil(otherMemberUserId)) {
                console.log(otherMemberUserId);
                
                const isUserOnline = await isUserConnected(io, otherMemberUserId);
                if (!isUserOnline) {
                    // send email to receiver
                    var args1 = {
                        data: { receiver_id: otherMemberUserId, sender_id: data.user_id,}, //send receiver id
                        headers: { "Content-Type": "application/json", "Authorization": data.hrs},
                        requesConfig: { timeout: 1000 },
                        responseConfig: { timeout: 9000 }
                    };
                    var req2 = client.post(API_URL+'/api/chat/email/', args1, async (resdata, response) => {
                        if(resdata['message'] == "Email Sent"){
                            console.log('email sent');
                            console.log(resdata);
                            console.log('status_code:'+ response.statusCode)
                        } else {
                            console.log('error');
                            console.log(resdata);
                            console.log('status_code:'+ response.statusCode)
                        }
                    });
                }
            }
        });

    });

    socket.on('remote nepal typing', (user_data) => {
        socket.broadcast.to(socket.room_name).emit('remote nepal typing', user_data);
    });

    socket.on('remote nepal delete message', (msg_data) => {
        socket.broadcast.to(socket.room_name).emit('remote nepal delete message', msg_data);
    });

});

// Initialize our websocket server on port 5001
http.listen(5001, () => {
    console.log('started on port 5001');
});