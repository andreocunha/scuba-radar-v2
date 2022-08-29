const socket = io.connect('http://localhost:4000');

let divRef = document.createElement('div');
divRef.setAttribute('class', 'scuba-radar');

let chatRef = document.createElement('section');
chatRef.setAttribute('class', 'msger');

window.onload = function () {
    // get the body element
    let body = document.getElementsByTagName('body')[0];
    // add the div to the body element
    body.appendChild(divRef);
    body.appendChild(chatRef);

    loadSocketIO();
    addChat(chatRef);
}

function loadSocketIO(){
    socket.on('connect', function () {
        console.log('connected');
        console.log(socket.id);

        // get the url of the current page
        var url = window.location.href;
        socket.emit('join', url);

        // show the id on div scuba-radar
        divRef.innerHTML += socket.id;
    });

    socket.on('usersInUrl', (users) => {
        console.log(users);
        if(users.length > 1){
            divRef.style.display = 'flex';
            divRef.innerHTML =`mais ${users.length - 1} ${users.length > 2 ? ' pessoas': ' pessoa'} aqui 💬`;
        }
        else {
            divRef.style.display = 'none';
        }
    })
    socket.on('message', (data) => {
        // console.log(data);
        const directionMessage = data.id == socket.id ? 'right' : 'left';
        appendMessage(data.nickname, data.photo, directionMessage, data.text);
    })
}

function sendMessage(message) {
    socket.emit('newMessage', message);
}

function addChat(element) {
    const chat = `<header class="msger-header">
        <div class="msger-header-title">
            <i class="fas fa-comment-alt"></i> Scuba Radar Chat
        </div>
        <div class="msger-header-options">
            <span><i class="fas fa-cog"></i></span>
        </div>
    </header>

    <main class="msger-chat"></main>
    <form class="msger-inputarea">
        <input type="text" class="msger-input" placeholder="Digite sua mensagem...">
        <button type="submit" class="msger-send-btn">Enviar</button>
    </form>`;

    element.innerHTML += chat;
    loadChatScript();
}

divRef.addEventListener('click', function () {
    console.log('clicked');
    // show if hidden
    if (chatRef.style.display === "none" || chatRef.style.display === "") {
        chatRef.style.display = "flex";
    }
    // hide if shown
    else {
        chatRef.style.display = "none";
    }
})