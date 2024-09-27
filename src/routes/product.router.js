const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { validateCreateProduct, validatePid, validateUpdateProduct } = require("../middlewares/validationMiddlewares");

// Lista de todos los productos
router.get("/", productController.listAllProducts);

// Muestra el producto con el pid proporcionado
router.get("/:pid", validatePid, productController.findProductById);

// Crea un nuevo producto
router.post("/", validateCreateProduct, productController.createProduct);

// Toma un producto y actualiza los campos enviados desde body sin modificar el id
router.put("/:pid", validatePid, validateUpdateProduct, productController.updateProduct);

// Elimina el producto con el pid indicado
router.delete("/:pid", validatePid, productController.deleteProduct);

module.exports = router;
