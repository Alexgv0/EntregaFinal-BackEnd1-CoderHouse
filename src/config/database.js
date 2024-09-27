// Connect ATLAS DB
const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/ProyectoFinal-BackEnd1-CoderHouse";

// Posible options

const connectDB = mongoose
    .connect(mongoURI) // Posible options
    .then(() => {
        console.log("Conectado a MongoDB Atlas");
    })
    .catch(error => {
        console.error("Error al intentar conectar a MongoDB Atlas: ", error);
    });

module.exports = connectDB;
