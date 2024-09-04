const express = require("express");
const router = express.Router();

const ProductManager = require("../../productManager");
const pm = new ProductManager();

router.get("/products", async (req, res) => {
    const products = await pm.readData();
    res.render("index", { title: "Productos", products});
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await pm.readData();
    res.render("realTimeProducts", { title: "Productos en Tiempo Real", products });
});

module.exports = router;
