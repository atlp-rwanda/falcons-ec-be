import socketio from "socket.io";
import db from "../database/models/index";
import tokenDecode from "../helpers/token_decode";

const { Message, User } = db;

const userObj = new Map();

const userExists = async (socket, next) => {
  try {
    const { token } = socket.handshake.headers;
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
          avatar: res.dataValues.avatar,
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
  io = socketio(http, { cors: { origin: "*" } });
  io.use((socket, next) => {
    if (socket.handshake.headers.token !== "null") {
      userExists(socket, next);
    } else {
      console.log("No validToken Found");
    }
  });

  io.on("connection", (socket) => {
    const senderId = socket.id;
    const { id, name, avatar } = userObj.get(senderId) || {};

    socket.join(`user-${id}`);

    socket.emit("username", { name, avatar });

    socket.on("new-user", (name) => {
      name = userObj.get(socket.id).name;
      socket.broadcast.emit("user-connected", name);
    });

    Message.findAll({
      include: [
        {
          model: User,
          attributes: ["avatar", "firstname", "role"],
        },
      ],
    })
      .then((res) => {
        if (res.length > 0) {
          const messages = res.map((message) => ({
            id: message.id,
            message: message.message,
            createdAt: message.createdAt,
            name: message.User.dataValues.firstname,
            senderId: message.sender_id,
            avatar: message.User.dataValues.avatar,
          }));
          socket.emit("all-messages", messages);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    socket.on("send-chat-message", (message) => {
      Message.create({
        sender_id: id,
        message: message.message,
      })
        .then((createdMessage) => {
          const formattedMessage = {
            id: createdMessage.id,
            message: createdMessage.message,
            createdAt: createdMessage.createdAt,
            name: name,
            senderId: id,
            avatar: avatar,
          };
          io.emit("chat-message", formattedMessage);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("istyping", data);
      console.log("Start typing", socket.id);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", userObj.get(socket.id).name);
      delete userObj[socket.id];
    });
  });
};

const ioConnectNotifications = (http) => {
  io = socketio(http, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    socket.on("join", (data) => {
      socket.join(data.id);
    });
  });
};

export { ioConnect, ioConnectNotifications, userExists, io };
