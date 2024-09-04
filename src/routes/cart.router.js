const express = require("express");
const CartManager = require("../../cartManager");
const router = express.Router();

const cartManager = new CartManager();

// Lista los productos que pertenezcan al carrito con el parámetro cid proporcionados
router.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const products = await cartManager.searchProductsByID(cid);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al buscar productos: ", error);
        res.status(500).json({ message: "Error al buscar productos en los carritos" });
    }
});

// Crea un nuevo carrito con la siguiente estructura:
/*
{
    Id : Number/String, (autogenerado, asegurando que no se repetirán los ids en el archivo)
    products: Array que contendrá objetos que representen cada producto
}
*/
router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart(req.body[0]);
        const carts = await cartManager.addCart(cart);
        await cartManager.saveCarts(carts);
        res.status(201).json({ message: "carrito agregado correctamente", cart: cart });
    } catch (error) {
        console.error("Error al agregar carrito: ", error);
        res.status(500).json({ message: "Error al agregar carrito a los carritos" });
    }
});

// Agrega el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
/*
    product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

    Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
*/
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const carts = await cartManager.addProductCarts(parseInt(cid), parseInt(pid));
        if (carts === undefined) {
            res.status(404).json({ message: "No existe el carrito al que se intenta ingresar el producto" });
            throw new Error("No existe el carrito al que se intenta ingresar el producto");
        }
        await cartManager.saveCarts(carts);
        res.status(201).json({ message: "Producto agregado al carrito correctamente", carts: carts });
    } catch (error) {
        console.error("Error desde router al agregar producto al carrito: ", error);
        res.status(500).json({ message: "No se pudo agregar el producto al carrito" });
    }
});

module.exports = router;
