const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('mongoose connect');
  } catch (error) {
    console.log('mongoose error');
  }
};

const server = app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
  connection();
});

const io = socket(server, {
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    let sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    }
  });

  console.log('connection: ', socket.id);
});
