const socket = io();

//handles the socket connection to server
socket.on('connect', () => {
    socket.emit('ready', getCookie("uuid"));
});

//called when the server emits the "call" event
socket.on("call", (id, peerid) => {;
    incomingCall(id, peerid);
});
