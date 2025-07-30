document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // Check if Enter key is pressed
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    if (userInput.trim() !== "") {
        appendMessage(userInput, 'user-message'); // Display user's message
        fetchResponse(userInput); // Send the message to the backend and handle the response
        document.getElementById('user-input').value = ''; // Clear the input field
    }
}

function appendMessage(text, className) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${className}`;
    messageContainer.textContent = text;
    document.getElementById('chatbot-messages').appendChild(messageContainer);
    document.getElementById('chatbot-body').scrollTop = document.getElementById('chatbot-body').scrollHeight;
}

function fetchResponse(userInput) {
    fetch('http://localhost:3001/api/chatbot', {  // Full URL of backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data.response;
        appendMessage(botResponse, 'bot-message');
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('Sorry, something went wrong.', 'bot-message');
    });
}
