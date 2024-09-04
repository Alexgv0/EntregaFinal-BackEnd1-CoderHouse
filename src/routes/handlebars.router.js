const express = require("express");
const router = express.Router();

router.get("/products", async (req, res) => {
    const products = await pm.readData();
    res.render("index", { title: "Productos", products});
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});

module.exports = router;
