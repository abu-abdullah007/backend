"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
const chattab = (0, uuid_1.v1)();
const roomId = {};
const user = {};
const userArray = [];
io.on('connection', socket => {
    console.log('New client connected');
    socket.on('set-room-id', (data) => {
        if (data.roomid) {
            roomId['roomname'] = data.roomid;
            socket.emit('go-next', {
                username: data.username,
                roomid: roomId.roomname
            });
            console.log(roomId);
        }
    });
    socket.on('join-room', (data) => {
        if (data.roomid === roomId.roomname) {
            socket.join(data.roomid);
            console.log('joined room');
            io.to(roomId.roomname).emit('join-not', data);
        }
    });
    socket.on('typing', data => {
        io.to(roomId.roomname).emit('type-event', data);
    });
    socket.on('send-message', (data) => {
        io.to(roomId.roomname).emit('catch-data', Object.assign({}, data));
    });
});
app.get('/', (request, response) => {
    response.status(200).json({
        message: "Hello World"
    });
});
server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
