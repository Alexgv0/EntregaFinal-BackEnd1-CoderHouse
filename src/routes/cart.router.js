const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { validateCid, validatePid, validateCartProducts, validateCart, validateQuantity} = require("../middlewares/validationMiddlewares");

// Lista los productos que pertenezcan al carrito con el parámetro cid proporcionados
router.get("/:cid", validateCid, cartController.searchCart);

// Crea un nuevo carrito con un Id y un arreglo de productos:
router.post("/", validateCartProducts, cartController.createCart);

// Agrega el producto al arreglo “products” del carrito seleccionado
router.post("/:cid/product/:pid", validateCid, validatePid, validateCart, cartController.addProductToCart);

// Deberá eliminar del carrito el producto seleccionado.
router.delete("/:cid/products/:pid", validateCid, validatePid, cartController.deleteProductFromCart);

// Deberá actualizar todos los productos del carrito con un arreglo de productos.
router.put("/:cid", validateCid, validateCartProducts, cartController.updateAllProductsFromCart);

// Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put("/:cid/products/:pid", validateCid, validatePid, validateQuantity, cartController.updateProductQuantityFormCart);

// Deberá eliminar todos los productos del carrito
router.delete("/:cid", validateCid, cartController.deleteAllProductsFromCart);

module.exports = router;
