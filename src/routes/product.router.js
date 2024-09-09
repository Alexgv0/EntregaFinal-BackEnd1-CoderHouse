const express = require("express");
//const ProductManager = require("../../productManager"); FS
const router = express.Router();
const mongoose = require("mongoose");

//const productManager = new ProductManager();  FS
const Product = require("./../models/products.model");

// Lista de todos los productos
router.get("/", async (req, res) => {
    try {
        //const products = await productManager.readData(); FS
        const products = await Product.find();
        console.log(products);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al listar productos: ", error);
        res.status(500).json({ message: "Error al listar productos" });
    }
});

// Muestra el producto con el pid proporcionado
router.get("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        if (!mongoose.isValidObjectId(pid)) {
            return res.status(400).json({ message: `ID con formato inválido: ${pid}` });
        }
        //const product = await productManager.searchProductByID(pid); FS
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ message: `No existe el producto con id: ${pid}` });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error al buscar producto: ", error);
        res.status(500).json({ message: "Error al buscar producto" });
    }
});

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
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!(title || description || code || price || status || stock || category || thumbnails)) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }
        //const newProduct = await productManager.createProduct(title, description, code, price, status, stock, category, thumbnails); FS
        //await productManager.addProducts(newProduct); FS
        const newProduct = await Product.create({ title, description, code, price, status, stock, category, thumbnails });
        //console.log(`Producto agregado existosamente: ${JSON.stringify(newProduct)}`);
        res.status(201).json({ message: "Producto agregado a la lista de productos satisfactoriamente.", payload: newProduct });
    } catch (error) {
        console.error("Error desde router al guardar el producto: ", error);
        if (error.code == "11000") {
            res.status(500).json({ error: "Error: El valor de 'code' ya existe en la base de datos" });
        } else {
            res.status(500).json({ error: "Error al agregar el producto" });
        }
    }
});

// Toma un producto y actualiza los campos enviados desde body sin modificar el id
router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        if (!mongoose.isValidObjectId(pid)) {
            return res.status(400).json({ message: `ID con formato inválido: ${pid}` });
        }
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
        //const [product] = await productManager.searchProductByID(pid);
        //const changes = productManager.filterValidFields({ id: pid, ...req.body }, product);
        //const newProducts = await productManager.updateProduct(changes);
        //console.log(typeof newProducts, newProducts);
        //await productManager.saveProducts(newProducts);
        await Product.updateOne({ _id: pid }, { $set: changes });
        res.status(200).json({ message: "Producto actualizado exitosamente.", changes: changes });
    } catch (error) {
        console.error("Error desde el router al actualizar producto: ", error);
        return res.status(500).json({ message: "Error al actualizar el producto" });
    }
});

// Elimina el producto con el pid indicado
router.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        if (!mongoose.isValidObjectId(pid)) {
            return res.status(400).json({ message: `ID con formato inválido: ${pid}` });
        }
        //const products = await productManager.readData(); FS
        //const deletedProduct = await productManager.deleteProduct(products, pid); FS
        //await productManager.saveProducts(products); FS
        const deletedProduct = await Product.deleteOne({ _id: pid });
        res.status(200).json({ message: "Producto eliminado exitosamente.", deleted: deletedProduct });
    } catch (error) {
        console.error("Error al eliminar producto: ", error);
        return res.status(500).json({ message: "Error al eliminar el producto." });
    }
});

module.exports = router;
