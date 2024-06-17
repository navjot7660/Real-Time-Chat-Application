document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    
    const socket = io('http://localhost:4000');
    
    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector('.container');

    const append = (message, position) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${position}`;
        messageElement.innerText = message;
        messageContainer.append(messageElement);
        console.log(`Appended message: ${message}`);
    };

    const name = prompt("Enter your name to join");
    socket.emit('new-user-joined', name);
    console.log(`User joined with name: ${name}`);

    socket.on('user-joined', name => {
        console.log(`Received user-joined event for: ${name}`);
        append(`${name} joined the chat`, 'left');
    });

    socket.on('receive', data => {
        console.log(`Received message from ${data.name}: ${data.message}`);
        append(`${data.name}: ${data.message}`, 'left');
    });
    socket.on('left',name=>{
        console.log(`${name} left the chat`,'left');
        append(`${name} left the chat`,'left');
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    });
});
