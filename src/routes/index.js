const express = require("express");
const router = express.Router();

const productRouter = require("./product.router");
const cartRouter = require("./cart.router");

router.use("/products", productRouter);
router.use("/carts", cartRouter);

module.exports = router;
