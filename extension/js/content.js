// Pergunta o nome do usuário e salva no storage
let userName = 'Anônimo';
function saveName() {
    // Pega o nome do usuário do local storage
    chrome.storage.sync.get(['name'], function(result) {
        if(result.name){
            userName = result.name;
        }
        else {
            let name = prompt("Por favor, digite seu nome:");
            chrome.storage.sync.set({ name }, () => {
                // console.log(`nome salvo: ${name}`);
            });
            // recarrega a página para atualizar o nome
            location.reload();
        }
    })
}
saveName();

// Novos elementos html
let divRef = document.createElement('div');
divRef.setAttribute('class', 'scuba-radar');

let chatRef = document.createElement('section');
chatRef.setAttribute('class', 'msger');

let chatIconRef = document.createElement('div');
chatIconRef.setAttribute('class', 'chat-icon');
let scubaIcon = '<img src="https://raw.githubusercontent.com/andreocunha/scuba-forum-extension/main/scuba-radar/icon.png" alt="scuba icon" height="90%" width="90%">'
chatIconRef.innerHTML = scubaIcon;


function start(){
    // Pega o body da página assim que carregar
    let body = document.getElementsByTagName('body')[0];

    // Adiciona novos elementos html na página
    body.appendChild(divRef);
    body.appendChild(chatRef);
    body.appendChild(chatIconRef);

    loadSocketIO(); // Carrega o socket.io
    createChat(chatRef); // cria o html do chat
}
start();

function divAreaIsClosed(div){
    if (div?.style.display === "none" || div?.style.display === "") {
        return true;
    }
    return false;
}

// Fica escutando os clicks no icone do chat
chatIconRef.addEventListener('click', function () {
    // Mostra o chat
    if (divAreaIsClosed(chatRef)) {
        chatRef.style.display = "flex";
        chatIconRef.style.backgroundColor = "#0536a7";
        chatIconRef.innerHTML = scubaIcon;
        numMessages = 0;
        document.title = tabName;
    }
    // Esconde o chat
    else {
        chatRef.style.display = "none";
    }
})

divRef.addEventListener('click', function () {
    const divScuba = document.getElementsByClassName('users')[0];
    // Mostra o chat
    if (divAreaIsClosed(divScuba)) {
        divScuba.style.display = "flex";
    }
    // Esconde o chat
    else {
        divScuba.style.display = "none";
    }
})