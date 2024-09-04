const fs = require("fs").promises;
const constants = require("./src/utils/constants")

const productsFilePath = constants.productsFilePath;

class ProductManager {
    constructor() {

    }

    // Lee la informacion de products.txt y lo parsea de JSON a Objeto
    async readData() {
        try {
            const data = await fs.readFile(productsFilePath, "utf8");
            const parsedData = JSON.parse(data);
            return parsedData;
        } catch (error) {
            console.error(`Error al leer datos: ${error}`);
            return [];
        }
    };

    /* Busca por id dentro de el arreglo de productos de productos.txt 
    y devuelve el producto con el id pasada por parametro */
    async searchProductByID(id) {
        const products = await this.readData();
        const product = products.filter(actualProduct => actualProduct.id === parseInt(id));
        return product;
    };

    // Devuelve el ultimo id de la lista de productos en products.txt
    async lastID() {
        const datos = await this.readData();
        if (datos.length > 0) {
            return datos[datos.length - 1].id;
        } else return 0;
    };

    // Guarda los cambios de products (pasado por parametro) en productos.txt
    async saveProducts(products) {
        try {
            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
        } catch (error) {
            console.error("Error desde productManager al guardar los productos: ", error);
        }
    };

    // Agrega un producto a products para luego sobreescribir products.txt con ese producto agregado
    async addProducts(product) {
        const products = await this.readData();
        products.push(product);
        await this.saveProducts(products);
    };

    // Crea un producto nuevo con los parametros dados y lo devuelve
    async createProduct(title, description, code, price, status, stock, category, thumbnails) {
        const pid = parseInt(await this.lastID());
        return {
            id: pid + 1,
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails,
        };
    };

    // Devuelve los cambios filtrando los posibles campos invalidos y dejando los de los productos
    filterValidFields(body, product) {
        return Object.keys(body).reduce((filtered, key) => {
            if (key in product) {
                filtered[key] = body[key];
            }
            return filtered;
        }, {});
    };

    // Actualiza el producto y lo sobreescribe en products.txt
    async updateProduct(updates) {
        const products = await this.readData();
        const newProducts = products.map(product => {
            if (product.id === updates.id) {
                return { ...product, ...updates };
            }
            return product;
        });
        return newProducts;
    };

    /* Elimina el producto con el id pasado por parametro de products que tambien es pasado por parametro,
     devuelve el producto eliminado */
    async deleteProduct(products, id) {
        const productIndex = products.findIndex(actualProduct => actualProduct.id === id);
        const deletedProduct = products.splice(productIndex, 1);
        return deletedProduct;
    };

}

module.exports = ProductManager;
