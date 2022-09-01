// const socket = io.connect('http://localhost:4000');
const socket = io.connect('https://scuba-radar-v2-server.onrender.com');


// carrega a conexão com o socket.io e os eventos
function loadSocketIO(){
  socket.on('connect', function () {
      console.log(socket.id + ' conectado');

      var url = window.location.href; // pega a url atual
      socket.emit('join', url, userName); // entra no time de pessoas na mesma url
  });

  // Recebe os usuários na mesma url
  socket.on('usersInUrl', (users) => {
      console.log(users);
      if(users?.length > 1){
          divRef.style.display = 'flex';
          divRef.innerHTML =`
            <p>mais ${users.length - 1} ${users.length > 2 ? ' pessoas': ' pessoa'} aqui</p>
            <div class="users">
                <h1>Usuários</h1>
                ${users.map(user => `
                    <div class="user">
                        <img src="${user.photo}" alt="${user.username}">
                        <p>${user.username}</p>
                    </div>
                `).join('')}
            </div>
          `;
      }
      else {
          divRef.style.display = 'none';
      }
  })

  // Recebe mensagens do chat
  socket.on('message', (data) => {
      const directionMessage = data.id == socket.id ? 'right' : 'left';
      appendMessage(data.nickname, data.photo, directionMessage, data.text);
  })
}

// envia mensagens para o chat
function sendMessage(message) {
  socket.emit('newMessage', message);
}