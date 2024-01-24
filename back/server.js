const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const {ConnectDb} = require('./database.connection')

const { DocumentModel } = require('./models');

const app = express();
ConnectDb();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

const Document = DocumentModel;

const users = {};

app.use(cors());
app.use(express.json());

app.use('/' , require('./routes'))

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', async (documentId, userId) => {
    socket.join(documentId);

    const document = await Document.findOne({ documentId });
    if (document) {
      socket.emit('document', document.content);
    } else {
      const newDocument = new Document({ documentId, content: '' });
      await newDocument.save();
      socket.emit('document', '');
    }

    users[socket.id] = { id: userId, documentId };
  });

  socket.on('edit', async (content) => {
    const user = users[socket.id];
    if (user) {
      await Document.findOneAndUpdate(
        { documentId: user.documentId },
        { content }
      );
      io.to(user.documentId).emit('document', content);
    }
  });
  

  socket.on('doc-updated', (context) => {
    socket.emit('update-code', context);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const user = users[socket.id];
    if (user) {
      io.to(user.documentId).emit('userLeft', user.id);
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
