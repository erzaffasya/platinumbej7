const socket = io()
const qS = el => {return document.querySelector(el)}
const qSA = el => {return document.querySelectorAll(el)}
const cE = el => {return document.createElement(el)}
const messageContainer = qS('#messageContainer')
const messageForm = qS('#messageForm')
const messageInput = qS('#messageInput')
const spanUsername = qS('#username')
const roomAdmin = qS('.roomAdmin')
const chatAdmin = qSA('.chatAdmin')
const inboxList = qS('#inboxList')

socket.on('userConnected', (user) => {
    spanUsername.innerText = userName
    appendMessage(`${user.name} joined this room`)
})

if(messageForm != null) {
    const returnPathHref = window.location.pathname.match(/.api.chat./)[0]
    const returnRoleHref = window.location.search.match(/\?role=user|\?role=admin/)[0]
    const accountRole = returnRoleHref.match(/user|admin/)[0]
    socket.emit('newUser', roomName, userName, accountRole)

    qS('#returnButton').href = returnPathHref + returnRoleHref
    messageForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        const message = messageInput.value
        socket.emit('sendChatMessage', roomName, message, accountRole)
        messageInput.value = ''
    })
}

chatAdmin.forEach(cA => {
    cA.onclick = (ev) => {
        if(ev.target.href != null) {
            const adminRoom = ev.target.href.match(/(?<=.api.chat.)\d+/)
            const userTargetId = ev.target.href.match(/(?<=id.)\d+/)
            socket.emit('userWannaChat', +adminRoom, +userTargetId)
        }
    }
})

socket.on('createInbox', (data) => {
    // console.log(data.room, data.user);
    const inboxLi = cE('li')
    const inboxSpan = cE('span')
    const inboxAnchor = cE('a')
    inboxSpan.innerText = `${data.name} `
    inboxAnchor.innerText = 'Join'
    inboxAnchor.href = `/api/chat/${data.room}?role=admin&id=${data.id}`
    inboxLi.append(inboxSpan)
    inboxLi.append(inboxAnchor)
    if(inboxList != null)
        inboxList.append(inboxLi)
    else if(inboxList == null) {
        roomAdmin.forEach(rA => {
            if(rA.innerText.match('')) {
                
            }
        })
    }
})

socket.on('userDisconnected', (name) => {
    appendMessage(`${name.split('-')[1]} left this room`)
})

socket.on('chatMessage', (data) => {
    // console.log(data);
    if(data.role != null)
        appendMessage(`${data.name.split('-')[1]} (${data.role}): ${data.message}`)
    else
        appendMessage(`${data.name.split('-')[1]}: ${data.message}`)
})

function appendMessage(message) {
    const messageElement = cE('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}