const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title : {type: String, required: true},
    description : {type: String, required: true},
    code : {type: String, required: true, unique: true},
    price : {type: Number, required: true},
    status : {type: Boolean, required: true},
    stock : {type: Number, required: true},
    category : {type: String, required: true},
    thumbnails : {type: String, required: true}
})

const cartSchema = new mongoose.Schema({
    products: {type: }
})

const Product = mongoose.model("Product", productSchema);
