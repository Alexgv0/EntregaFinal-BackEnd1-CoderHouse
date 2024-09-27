const express = require("express");
const router = express.Router();
const handlebarsController = require("../controllers/handlebarsController");

router.get("/products", handlebarsController.getAllUsersPaginate);

router.get("/realtimeproducts", handlebarsController.renderRealTimeProducts);

module.exports = router;
