const express = require("express");
const CartManager = require("../../cartManager");
const router = express.Router();
const mongoose = require("mongoose");

//const cartManager = new CartManager(); FS
const Cart = require("./../models/carts.model");
const Product = require("./../models/products.model");

// Lista los productos que pertenezcan al carrito con el parámetro cid proporcionados
router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        if (!mongoose.isValidObjectId(cid)) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        //const products = await cartManager.searchProductsByID(cid); FS
        const products = await Cart.findById(cid);
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
        //const cart = await cartManager.createCart(req.body[0]); FS
        //const carts = await cartManager.addCart(cart); FS
        //await cartManager.saveCarts(carts); FS
        const { products } = req.body;
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "El carrito debe tener al menos un producto" });
        }
        //console.log(products);
        const cart = await Cart.create({ products });
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
        //const carts = await cartManager.addProductCarts(parseInt(cid), parseInt(pid)); FS
        /* if (carts === undefined) {
            res.status(404).json({ message: "No existe el carrito al que se intenta ingresar el producto" });
            throw new Error("No existe el carrito al que se intenta ingresar el producto");
        } */
        //await cartManager.saveCarts(carts); FS
        if (!mongoose.isValidObjectId(cid)) {
            return res.status(400).json({ error: `cid con formato inválido: ${cid}` });
        }
        if (!mongoose.isValidObjectId(pid)) {
            return res.status(400).json({ error: `pid con formato inválido: ${pid}` });
        }
        const cart = await Cart.findById(cid);
        if (cart.length === 0) {
            return res.status(404).json({ message: "No existe el carrito al que se intenta ingresar el producto" });
        }
        const product = await Product.findById(pid);
        if (product.length === 0) {
            return res.status(404).json({ message: "No existe el producto que se intenta ingresar al carrito" });
        }
        const productInCart = cart.products.find(item => item.product.equals(pid));
        if (productInCart) {
            productInCart.quantity++;
            // Opcion alterna
            await Cart.updateOne(
                { _id: cid, "products.product": pid }, 
                { $inc: { "products.$.quantity": 1 } }
            ); 
        } else {
            //cart.products.push({ product: product._id, quantity: 1 }); //Opcion mas corta
            // Opcion alterna
            await Cart.updateOne(
                { _id: cid }, 
                { $push: { products: { product: pid, quantity: 1 } } }
            ); 
           
        }
        //await cart.save(); // Opcion mas corta
        res.status(201).json({ message: "Producto agregado al carrito correctamente", payload: productInCart || { product: product._id, quantity: 1 } });
    } catch (error) {
        console.error("Error desde router al agregar producto al carrito: ", error);
        res.status(500).json({ message: "No se pudo agregar el producto al carrito" });
    }
});

// Deberá eliminar del carrito el producto seleccionado.
router.delete("/:cid/products/:pid", async () => {});

// Deberá actualizar todos los productos del carrito con un arreglo de productos.
router.put("/:cid", async () => {});

// Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put("/:cid/products/:pid", async () => {});

// Deberá eliminar todos los productos del carrito
router.delete("/:cid", async () => {});

module.exports = router;
