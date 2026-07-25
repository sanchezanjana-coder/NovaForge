const input = document.getElementById("messageInput");
const button = document.getElementById("sendButton");
const messages = document.getElementById("messages");

function sendMessage() {

    const text = input.value.trim();

    if (text === "") return;

    const userMessage = document.createElement("div");

    userMessage.className = "userMessage";

    userMessage.textContent = text;

    messages.appendChild(userMessage);

    input.value = "";

    messages.scrollTop = messages.scrollHeight;

}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

});
