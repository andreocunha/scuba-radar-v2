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
      console.log('USERS:', users);
      io.to(url).emit('usersInUrl', users);
      return users;
    }
  }

  function verifyUserInUrl(url, userName){
    const clients = usersInUrl(url);
    if(clients){
      for(const client of clients){
        if(client.username == userName){
          return true;
        }
      }
    }
    return false;
  }

  socket.on('join', (url, userName) => {
    console.log('USERNAME:', userName);
    if(!verifyUserInUrl(url, userName)){
      socket.username = userName;
      socket.url = url;
      socket.photo = `https://www.gravatar.com/avatar/${Math.floor(Math.random()*10000)}?s=90&d=identicon`;
      socket.join(url);
      usersInUrl(url);
    }
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