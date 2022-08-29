const port = process.env.PORT || 4000;

const io = require("socket.io")(port, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
  console.log('USER:', socket.id);

  function usersInUrl(url) {
    const users = [];
    const clients = io.sockets.adapter.rooms.get(url);

    if (clients) {
      for (const clientId of clients) {
        //this is the socket of each client in the room.
        const clientSocket = io.sockets.sockets.get(clientId);
        // console.log('CLIENT SOCKET:', clientSocket.username);
        users.push({
          id: clientSocket.id,
          username: clientSocket.username,
          photo: clientSocket.photo,
        });
      }
      io.to(url).emit('usersInUrl', users);
    }
  }

  socket.on('join', (url) => {
    socket.username = socket.id + " - ANDRE";
    socket.url = url;
    socket.photo = `https://secure.gravatar.com/avatar/${socket.id}?s=90&d=identicon`;
    socket.join(url);
    usersInUrl(url);
  })

  socket.on('newMessage', (message) => {
    // console.log(message);
    io.to(socket.url).emit('message', {
      id: socket.id,
      nickname: socket.username,
      photo: socket.photo,
      text: message,
    });
  })

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED:', socket.id);
    usersInUrl(socket.url);
  });
});