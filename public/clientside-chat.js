const socket = io()
const qS = el => {return document.querySelector(el)}
const cE = el => {return document.createElement(el)}
const messageContainer = qS('#messageContainer')
const messageForm = qS('#messageForm')
const messageInput = qS('#messageInput')
const username = 'user' + Math.floor(Math.random() * 100)

if(messageForm != null) {
    socket.emit('newUser', roomName, username)

    messageForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        const message = messageInput.value
        socket.emit('sendChatMessage', roomName, message)
        messageInput.value = ''
    })
}

socket.on('userDisconnected', (name) => {
    appendMessage(name)
})

socket.on('chatMessage', (data) => {
    // console.log(data);
    appendMessage(data)
})

function appendMessage(message) {
    const messageElement = cE('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}