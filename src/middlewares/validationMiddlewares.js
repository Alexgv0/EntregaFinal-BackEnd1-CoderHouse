const { default: mongoose } = require("mongoose");
const Cart = require("../models/carts.model");
const Product = require("../models/products.model");

exports.validateCid = async (req, res, next) => {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid);
    if (!cid) {
        return res.status(400).json({ error: "El cid es requerido." });
    }
    if (!mongoose.isValidObjectId(cid)) {
        return res.status(400).json({ error: `cid con formato inválido: ${cid}` });
    }
    if (!cart || (cart.length === 0)) {
        return res.status(404).json({ message: `Carrito con cid ${cid} no encontrado` });
    }

    next();
};

exports.validatePid = async (req, res, next) => {
    const pid = req.params.pid;
    const product = await Product.findById(pid);
    if (!pid) {
        return res.status(400).json({ error: "El pid es requerido." });
    }
    if (!mongoose.isValidObjectId(pid)) {
        return res.status(400).json({ error: `pid con formato inválido: ${pid}` });
    }
    if (!product || (product.length === 0)) {
        return res.status(404).json({ message: `Producto con pid ${pid} no encontrado` });
    }

    next();
};

exports.validateCreateProduct = (req, res, next) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!(title && description && code && price && status && stock && category && thumbnails)) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "El precio debe ser un número igual o mayor que 0" });
    }

    if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ error: "El stock debe ser un número igual o mayor que 0" });
    }

    if (typeof code !== "string" || code.trim() === "") {
        return res.status(400).json({ error: "El codigo debe ser una cadena no vacia" });
    }

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "El titulo debe ser una cadena no vacia" });
    }

    if (typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({ error: "La descripcion debe ser una cadena no vacia" });
    }

    if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({ error: "La categoria debe ser una cadena no vacia" });
    }

    if (!thumbnails.every(thumbnail => typeof thumbnail === "string")) {
        return res.status(400).json({ error: "Cada thumbnail deben de ser strings" });
    }

    next();
};

exports.validateUpdateProduct = (req, res, next) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (price !== undefined) {
        if (typeof price !== "number" || price <= 0) {
            return res.status(400).json({ error: "El precio debe ser un número mayor que 0" });
        }
    }

    if (stock !== undefined) {
        if (typeof stock !== "number" || stock < 0) {
            return res.status(400).json({ error: "El stock debe ser un número mayor o igual que 0" });
        }
    }

    if (code !== undefined) {
        if (typeof code !== "string" || code.trim() === "") {
            return res.status(400).json({ error: "El código debe ser una cadena no vacía" });
        }
    }

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "El título debe ser una cadena no vacía" });
        }
    }

    if (description !== undefined) {
        if (typeof description !== "string" || description.trim() === "") {
            return res.status(400).json({ error: "La descripción debe ser una cadena no vacía" });
        }
    }

    if (category !== undefined) {
        if (typeof category !== "string" || category.trim() === "") {
            return res.status(400).json({ error: "La categoría debe ser una cadena no vacía" });
        }
    }

    if (thumbnails !== undefined) {
        if (!Array.isArray(thumbnails)) {
            return res.status(400).json({ error: "Thumbnails debe ser un arreglo de strings" });
        }
        if (!thumbnails.every(thumbnail => typeof thumbnail === "string")) {
            return res.status(400).json({ error: "Cada thumbnail debe ser una cadena" });
        }
    }

    next();
};

exports.validateCartProducts = async (req, res, next) => {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "El carrito debe tener al menos un producto" });
    }

    for (const item of products) {
        if (!item.product || !mongoose.isValidObjectId(item.product)) {
            return res.status(400).json({ error: "Cada producto debe contener un ID valido" });
        }
        if (typeof item.quantity !== "number" || item.quantity < 0) {
            return res.status(400).json({ error: "La cantidad debe ser un numero mayor o igual a cero" });
        }
    }

    next();
};

exports.validateCart = async (req, res, next) => {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (cart.length === 0) {
        return res.status(404).json({ message: "No existe el carrito al que se intenta ingresar el producto" });
    }

    next();
};

exports.validateQuantity = (req, res, next) => {
    const { quantity } = req.body;
    if (isNaN(parseInt(quantity)) || parseInt(quantity) < 0) {
        return res.status(400).json({ error: `Cantidad pasada por body inválida: ${quantity}` });
    }

    next();
};
