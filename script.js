// =======================================
// TBP AI Assistant
// script.js
// Version 1.0
// =======================================

const chatBox = document.getElementById("chatBox");
const prompt = document.getElementById("prompt");
const sendBtn = document.getElementById("send");
const typing = document.getElementById("typing");
const newChat = document.getElementById("newChat");

const BACKEND_URL = "https://YOUR-RENDER-BACKEND.onrender.com/chat";

let chats = [];

function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(text, type) {

    const div = document.createElement("div");

    div.className = type === "user"
        ? "user-message"
        : "bot-message";

    div.innerHTML = text;

    chatBox.appendChild(div);

    scrollBottom();

}

function saveChat() {

    localStorage.setItem(
        "tbp_ai_history",
        JSON.stringify(chats)
    );

}

function loadChat() {

    const data = localStorage.getItem(
        "tbp_ai_history"
    );

    if (!data) return;

    chats = JSON.parse(data);

    chatBox.innerHTML = "";

    chats.forEach(chat => {

        addMessage(chat.text, chat.type);

    });

}

loadChat();
// =======================================
// Part 3B
// Send Message + Backend Request
// =======================================

async function sendMessage() {

    const text = prompt.value.trim();

    if (!text) return;

    addMessage(text, "user");

    chats.push({
        type: "user",
        text: text
    });

    saveChat();

    prompt.value = "";

    typing.style.display = "flex";

    try {

        const response = await fetch(BACKEND_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });

        const data = await response.json();

        typing.style.display = "none";

        const reply = data.reply || "কোনো উত্তর পাওয়া যায়নি।";

        addMessage(reply, "bot");

        chats.push({

            type: "bot",

            text: reply

        });

        saveChat();

    }

    catch (error) {

        typing.style.display = "none";

        addMessage(
            "❌ Backend-এর সাথে সংযোগ করা যায়নি।",
            "bot"
        );

        console.error(error);

    }

}

sendBtn.addEventListener("click", sendMessage);

prompt.addEventListener("keydown", function(e){

    if(e.key === "Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});

newChat.addEventListener("click", () => {

    if(confirm("নতুন Chat শুরু করতে চান?")){

        chats = [];

        localStorage.removeItem("tbp_ai_history");

        location.reload();

    }

});
