const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                _id: false,
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
            },
        ],
        required: true,
    },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
