// creating our express server
const express = require('express');

// creating our app variable
const app = express();

// creating an http server
const server = require('http').Server(app);

// create a socket object and pass our server reference 
const io = require('socket.io')(server);

// generating a unique identifier
const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');
// setting up our static folder
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
    console.log(req.params);
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        io.to(roomId).emit('user-connected', userId);        

        // when ever user disconnects from the server
        socket.on('disconnect', () => {
            io.to(roomId).emit('user-disconnected', userId);
        });
    });

});

server.listen(3000);