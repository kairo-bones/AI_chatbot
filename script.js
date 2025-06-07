const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatContainer = document.getElementById('chat-container');
let conversationHistory = [];

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();

    if (!userMessage) return;

   
    addMessageToChat('user', userMessage);
    messageInput.value = '';

   
    conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    
    const typingIndicator = addMessageToChat('bot', '...', true);

    try {
        const response = await fetch('https://ai-chatbot-qkt8.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                history: conversationHistory,
                message: userMessage
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botReply = data.reply;

       
        typingIndicator.remove();
        addMessageToChat('bot', botReply);

        conversationHistory.push({
            role: 'model',
            parts: [{ text: botReply }]
        });

    } catch (error) {
        console.error('Error:', error);
        typingIndicator.remove();
        addMessageToChat('bot', 'Abe server mein kuch lafda ho gaya hai. Baad mein try kar.');
    }
});

function addMessageToChat(sender, text, isTyping = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    const avatar = document.createElement('span');
    avatar.classList.add('avatar');
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    
    if (sender === 'user') {
        messageElement.classList.add('user-message');
        avatar.textContent = '👤';
    } else {
        messageElement.classList.add('bot-message');
        avatar.textContent = '🤖';
        if(isTyping) {
            messageText.classList.add('typing-indicator');
        }
    }
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(messageText);
    chatContainer.appendChild(messageElement);

    
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return messageElement;
}