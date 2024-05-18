const socketIO = require('socket.io');


function init(server) {
    const io = new socketIO.Server(server);
    io.on('connection', (socket) => {
        const numberOfClients = io.engine.clientsCount   //計算連線人數


        socket.broadcast.emit(
            'newUser', 
            `目前有${numberOfClients}人`
        )  //廣播給其他人

    })


}


module.exports = init
