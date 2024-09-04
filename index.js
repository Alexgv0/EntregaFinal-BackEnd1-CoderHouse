const app = require("./src/app");
const PORT = 8080;
const {Server} = require('socket.io');
const ProductManager = require("./productManager");
const pm = new ProductManager();

const server = app.listen(PORT, () => {
    console.log(`
        Servidor escuchando en el puerto: ${PORT}.
        Puedes acceder en el siguiente enlace: http://localhost:${PORT}
    `);
});

const io = new Server(server);

io.on('connection', async (socket) => {
    console.log(`Usuario ${socket.id} conectado`);
    // FIXME:
    let products = await pm.readData();

    socket.emit('allProducts', products);

    socket.on('addProduct', (product) => {
        products.push(product);
        io.emit('productAdded', product);
        console.log(`Producto agregado: ${JSON.stringify(product)}`);
    });

    socket.on('deleteProduct', (pid) => {
        products = products.filter(p => p.id !== pid);
        io.emit('productDeleted', pid);
        console.log(`Producto con el id: ${pid} eliminado`);
    });

    socket.on("disconnect", () => {
        console.log(`Usuario ${socket.id} desconectado`);
    });
});

module.exports = server;