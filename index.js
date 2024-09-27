const app = require("./src/app");
const { Server } = require("socket.io");
const Product = require("./src/models/products.model");

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`
        Servidor escuchando en el puerto: ${PORT}.
        Puedes acceder en el siguiente enlace: http://localhost:${PORT}
    `);
});

// Utilizando WebSockets
const io = new Server(server);

io.on("connection", async socket => {
    console.log(`Usuario ${socket.id} conectado`);
    // FIXME:
    //let products = await pm.readData(); FS
    const products = await Product.find().select("title").lean();

    socket.emit("allProducts", products);

    socket.on("addProduct", product => {
        products.push(product);
        io.emit("productAdded", product);
        console.log(`Producto agregado: ${JSON.stringify(product)}`);
    });

    socket.on("deleteProduct", pid => {
        products = products.filter(p => p.id !== pid);
        io.emit("productDeleted", pid);
        console.log(`Producto con el id: ${pid} eliminado`);
    });

    socket.on("disconnect", () => {
        console.log(`Usuario ${socket.id} desconectado`);
    });
});

module.exports = server;
