const express = require("express");
const ProductManager = require("../../productManager");
const router = express.Router();

const productManager = new ProductManager();

// Lista de todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await productManager.readData();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al listar productos: ", error);
        res.status(500).json({ message: "Error al listar productos" });
    }
});

// Muestra el producto con el pid proporcionado
router.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productManager.searchProductByID(pid);
        if (product.length === 0) {
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
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!(title || description || code || price || status || stock || category || thumbnails)) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    try {
        const newProduct = await productManager.createProduct(title, description, code, price, status, stock, category, thumbnails);
        await productManager.addProducts(newProduct);
        //console.log(`Producto agregado existosamente: ${JSON.stringify(newProduct)}`);
        res.status(201).json({ message: "Producto agregado a la lista de productos satisfactoriamente.", product: newProduct });
    } catch (error) {
        console.error("Error desde router al guardar el producto: ", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

// Toma un producto y actualiza los campos enviados desde body sin modificar el id
router.put("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (pid < 1) {
            return res.status(404).json({ message: `El pid no es correcto, pid: ${pid}` });
        }
        const [product] = await productManager.searchProductByID(pid);
        const changes = productManager.filterValidFields({ id: pid, ...req.body }, product);
        const newProducts = await productManager.updateProduct(changes);
        // console.log(typeof newProducts, newProducts);
        await productManager.saveProducts(newProducts);
        res.status(200).json({ message: "Producto actualizado exitosamente.", changes: changes });
    } catch (error) {
        console.error("Error desde el router al actualizar producto: ", error);
        return res.status(500).json({ message: "Error al actualizar el producto" });
    }
});

// Elimina el producto con el pid indicado
router.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (pid < 1) {
            return res.status(404).json({ message: `El pid no es correcto, pid: ${pid}` });
        }
        const products = await productManager.readData();
        const deletedProduct = await productManager.deleteProduct(products, pid);
        await productManager.saveProducts(products);
        res.status(200).json({ message: "Producto eliminado exitosamente.", deleted: deletedProduct });
    } catch (error) {
        console.error("Error al eliminar producto: ", error);
        return res.status(500).json({ message: "Error al eliminar el producto." });
    }
});

module.exports = router;
