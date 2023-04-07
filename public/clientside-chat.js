const socket = io()
const qS = el => {return document.querySelector(el)}
const cE = el => {return document.createElement(el)}
const messageContainer = qS('#messageContainer')
const messageForm = qS('#messageForm')
const messageInput = qS('#messageInput')
const spanUsername = qS('#username')
const username = 'user' + Math.floor(Math.random() * 1000)

if(messageForm != null) {
    spanUsername.innerText = username
    socket.emit('newUser', roomName, username)

    messageForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        const message = messageInput.value
        socket.emit('sendChatMessage', roomName, message)
        messageInput.value = ''
    })
}

socket.on('userConnected', (name) => {
    appendMessage(`${name} joined this room`)
})

socket.on('userDisconnected', (name) => {
    appendMessage(`${name} left this room`)
})

socket.on('chatMessage', (data) => {
    // console.log(data);
    appendMessage(`${data.name}: ${data.message}`)
})

function appendMessage(message) {
    const messageElement = cE('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}