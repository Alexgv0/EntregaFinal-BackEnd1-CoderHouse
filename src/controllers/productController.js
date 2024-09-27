const mongoose = require("mongoose");
const Product = require("./../models/products.model");

// Lista de todos los productos
exports.listAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al listar productos: ", error);
        res.status(500).json({ message: "Error al listar productos" });
    }
};

// Muestra el producto con el pid proporcionado
exports.findProductById = async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await Product.findById(pid);
        res.status(200).json(product);
    } catch (error) {
        console.error("Error al buscar producto: ", error);
        res.status(500).json({ message: "Error al buscar producto" });
    }
};

/* Agrega un nuevo producto con los campos:
{
    id: Number/String, (autogenerado, asegurando que no se repetirán los ids en el archivo)
    title : String,
    description : String,
    code : String,
    price : Number,
    status : Boolean,
    stock : Number,
    category : String,
    thumbnails : Array de Strings (que contengan las rutas donde están almacenadas las imágenes referentes a dicho producto)
}
*/
exports.createProduct = async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        const newProduct = await Product.create({ title, description, code, price, status, stock, category, thumbnails });
        res.status(201).json({ message: "Producto agregado a la lista de productos satisfactoriamente.", payload: newProduct });
    } catch (error) {
        console.error("Error desde router al guardar el producto: ", error);
        if (error.code == "11000") {
            return res.status(400).json({ error: "Error: El valor de 'code' ya existe en la base de datos" });
        }
        return res.status(500).json({ error: "Error al agregar el producto" });
    }
};

// Toma un producto y actualiza los campos enviados desde body sin modificar el id
exports.updateProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        const changes = {};

        if (title !== undefined) changes.title = title;
        if (description !== undefined) changes.description = description;
        if (code !== undefined) changes.code = code;
        if (price !== undefined) changes.price = price;
        if (status !== undefined) changes.status = status;
        if (stock !== undefined) changes.stock = stock;
        if (category !== undefined) changes.category = category;
        if (thumbnails !== undefined) changes.thumbnails = thumbnails;

        const payload = await Product.updateOne({ _id: pid }, { $set: changes });

        if (payload.modifiedCount === 0) {
            return res.status(200).json({ message: "No se ha podido modificar el producto. Tal vez ya tenia estos valores" });
        }

        res.status(200).json({ message: "Producto actualizado exitosamente.", changes: changes });
    } catch (error) {
        console.error("Error desde el router al actualizar producto: ", error);
        return res.status(500).json({ message: "Error al actualizar el producto" });
    }
};

// Elimina el producto con el pid indicado
exports.deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        if (!mongoose.isValidObjectId(pid)) {
            return res.status(400).json({ message: `pid con formato inválido: ${pid}` });
        }
        const payload = await Product.deleteOne({ _id: pid });
        if (payload.deletedCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado exitosamente.", payload });
    } catch (error) {
        console.error("Error al eliminar producto: ", error);
        return res.status(500).json({ message: "Error al eliminar el producto." });
    }
};
