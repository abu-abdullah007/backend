import express, { Application, Request, Response } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import 'dotenv/config'
import { v1 as uuid1 } from 'uuid'
import cors from 'cors'

const PORT = process.env.PORT
const app: Application = express()
const server = http.createServer(app)
app.use(cors())
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

const chattab = uuid1()
const roomId: { [key: string]: string } = {}
const user:{ [key: string]: string }  = {}
const userArray = []

io.on('connection', socket => {
    console.log('New client connected');

    socket.on('set-room-id', (data) => {
        if (data.roomid) {
            roomId['roomname'] = data.roomid
            socket.emit('go-next', {
                username: data.username,
                roomid: roomId.roomname
            })
            console.log(roomId)
        }
    });

    socket.on('join-room', (data) => {
        if (data.roomid === roomId.roomname) {
            socket.join(data.roomid)
            console.log('joined room')
            io.to(roomId.roomname).emit('join-not', data)
        }
    })

    socket.on('typing', data => {
        io.to(roomId.roomname).emit('type-event', data)
    })

    socket.on('send-message', (data) => {
        io.to(roomId.roomname).emit('catch-data', { ...data })
    })

})

app.get('/', (request: Request, response: Response) => {
    response.status(200).json({
        message: "Hello World"
    })
})

server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})