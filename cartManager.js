const fs = require("fs").promises;
const constants = require("./src/utils/constants")

const cartsFilePath = constants.cartsFilePath;

class CartManager {
    constructor() {

    }

    // Lee la informacion de carts.txt y lo parsea de JSON a Objeto
    async readCartsData() {
        try {
            const data = await fs.readFile(cartsFilePath, "utf8");
            const parsedData = JSON.parse(data);
            return parsedData;
        } catch (error) {
            console.error("Error al leer datos de carrito: ", error);
            return [];
        }
    };

    /* Busca por id dentro de los carritos de carts.txt 
    y devuelve los productos del carrito con el id pasado por parametro */
    async searchProductsByID(id) {
        try {
            const cart = await this.readCartsData();
            const cartProducts = cart.filter(actualProduct => actualProduct.Id === parseInt(id));
            const products = cartProducts[0].products;
            return products;
        } catch (error) {
            console.error("Error al buscar productos por id de carrito: ", error);
        }
    };

    // Devuelve el ultimo id de la lista de carritos en carts.txt
    async lastCartID() {
        try {
            const datos = await this.readCartsData();
            if (datos.length > 0) {
                return datos[datos.length - 1].Id;
            } else {
                console.error("No hay carritos");
                return 0;
            }
        } catch (error) {
            console.error("Error al buscar el ultimo id: ", error);
        }
    };

    // Crea un carrito nuevo con los parametros dados y lo devuelve
    async createCart(body) {
        try {
            const products = body.products;
            const Id = await this.lastCartID() + 1;
            const newCart = {
                Id : Id,
                products : products
            };
            return newCart;
        } catch (error) {
            console.error("Error al crear carrito: ", error);
        } 
    };

    // Devuelve los carritos de carts.txt con el carrito (cart) pasado por parametro agregado
    async addCart(cart) {
        try {
            const carts = await this.readCartsData();
            carts.push(cart);
            return carts;
        } catch (error) {
            return console.error("Error agregando cart a carts: ", error)
        }
    };

    // Guarda los cambios de carts (pasado por parametro) en carts.txt
    async saveCarts(carts) {
        try {
            await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
        } catch (error) {
            console.error("Error desde productManager al guardar los productos: ", error);
        }
    };

    //
    async addProductCarts(cid, pid) {
        try {
            if (await this.lastCartID() < cid) {
                throw new Error("El carrito al que se esta intentando agregar un producto no existe");
            }
            const carts = await this.readCartsData();
            carts.forEach((cart) => {
                if ((cart.Id === parseInt(cid)) ){
                    const productIndex = cart.products.findIndex((product) => product.product === parseInt(pid));
                    if (productIndex >= 0) {
                        cart.products[productIndex].quantity++;
                        return;
                    } else {
                        cart.products.push({
                            product: parseInt(pid),
                            quantity: 1
                        });
                        return;
                    }
                }
            });
            if (carts === undefined) {
                throw new Error("El carrito al que se esta intentando agregar un producto no existe");
            }
            return carts;
        } catch (error) {
            return console.error("Error desde cartManager al agregar productos en el carrito: ", error);
        }
    }

}

module.exports = CartManager;
