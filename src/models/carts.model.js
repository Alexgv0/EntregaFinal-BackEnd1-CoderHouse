const mongoose = require("mongoose");
const Product = require("./products.model");

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                products: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required: true },
                quantity: { type: Number, required: true },
            },
        ],
    },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;