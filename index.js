const app = require("./src/app");
const PORT = 8080;
const {Server, Socket} = require('socket.io')

const server = app.listen(PORT, () => {
    console.log(`
        Servidor escuchando en el puerto: ${PORT}.
        Puedes acceder en el siguiente enlace: http://localhost:${PORT}
    `);
});

const io = new Server(server);
// TODO:
io.on("connection", socket => {
    console.log(`Usuario ${socket.id} conectado`);

    socket.on("addProduct", product => {
        console.log(`Producto agregado: ${socket}`);
        socket.emit("productAdded", product);
    });

    socket.on("deleteProduct", pid => {
        console.log(`Producto cone el id: ${pid} eliminado`);
        socket.emit("productDeleted", pid);
    });

    socket.on("disconnect", () => {
        console.log(`Usuario ${socket.id} desconectado`);
    });
});

module.exports = server;