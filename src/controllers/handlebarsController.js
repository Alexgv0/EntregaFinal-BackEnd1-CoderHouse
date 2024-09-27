const Product = require("../models/products.model");

exports.getAllUsersPaginate = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find().skip(skip).limit(limit).lean();
        const count = await Product.countDocuments();
        const totalPages = Math.ceil(count / limit);
        const nextPage = (page < totalPages) ? page + 1 : null;
        const prevPage = page != 0? page-1: null;

        res.render("index", { title: "Productos", products, currentPage: page, prevPage, nextPage, totalPages, limit});
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

exports.renderRealTimeProducts = (req, res) => {
    res.render("realTimeProducts");
}