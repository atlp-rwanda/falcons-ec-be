import socketio from 'socket.io';
import db from '../database/models/index';
import tokenDecode from '../helpers/token_decode';

const { Message, User } = db;

const userObj = new Map();

const userExists = async (socket, next) => {
  try {
    const token = socket.handshake.headers.token;
    const { payload } = await tokenDecode(token);
    User.findOne({
      where: {
        id: payload.id,
      },
    }).then((res) => {
      if (res) {
        userObj.set(socket.id, {
          id: res.dataValues.id,
          name: res.dataValues.firstname,
        });

        next();
      } else {
        next(new Error("user doesn't exist"));
      }
    });
  } catch (error) {
    console.log(error);
  }
};

let io;

const ioConnect = (http) => {
  io = socketio(http, { cors: { origin: '*' } });
  io.use((socket, next) => {
    if (socket.handshake.headers.token !== 'null') {
      userExists(socket, next);
    } else {
      console.log('No validToken Found');
    }
  });
  const users = {};

  io.on('connection', (socket) => {
    const senderId = socket.id;
    const { id, name } = userObj.get(senderId) || {};

    socket.join(`user-${id}`);

    socket.emit('username', name);

    socket.on('new-user', (name) => {
      name = userObj.get(socket.id).name;
      socket.broadcast.emit('user-connected', name);
    });
    Message.findAll({
      include: [
        {
          model: User,
          attributes: ['avatar', 'firstname', 'role'],
        },
      ],
    })
      .then((res) => {
        if (res.length > 0) {
          const messages = res.map((message) => {
            return {
              message: message.message,
              createdAt: message.createdAt,
              name: message.User.dataValues.firstname,
            };
          });
          socket.emit('all-messages', messages);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    socket.on('send-chat-message', (message) => {
      Message.create({
        sender_id: id,
        message: message.message,
      }).catch((error) => {
        console.error(error);
      });
      socket.broadcast.emit('chat-message', {
        message: message.message,
        name: message.username,
        date: message.date,
      });
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userObj.get(socket.id).name);
      delete users[socket.id];
    });
  });
};

export { ioConnect, userExists, io };
