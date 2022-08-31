let msgerForm = null;
let msgerInput = null;
let msgerChat = null;
let tabName = document?.title;
let numMessages = 0;

function loadChatScript() {
  msgerForm = get(".msger-inputarea");
  msgerInput = get(".msger-input");
  msgerChat = get(".msger-chat");

  msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    msgerInput.value = "";
    sendMessage(msgText);
  });
}

function createChat(element) {
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

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  numMessages++;
  divAreaIsClosed(chatRef) ? showMessageNotification() : numMessages = 0;

  const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
          </div>

          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function showMessageNotification() {
  document.title = `(${numMessages}) ` + tabName;
  chatIconRef.style.backgroundColor = "red";
  chatIconRef.innerHTML = '<p style="color: white;">' + numMessages + '</p>';
}