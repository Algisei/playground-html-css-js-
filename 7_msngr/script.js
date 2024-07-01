// script.js
document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-form');
    const textarea = messageForm.querySelector('textarea');
    const threadList = document.querySelector('.thread-list');

    messageForm.querySelector('button').addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            addMessageToThread(message);
            textarea.value = '';
        }
    });

    function addMessageToThread(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        threadList.appendChild(messageElement);
        threadList.scrollTop = threadList.scrollHeight;
    }
});
