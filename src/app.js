const express = require("express");
const app = express();
const routes = require("./routes");
const path = require("path");

// requierimientos de Handlebars
const exphbs = require("express-handlebars");
const handlebarsRouter = require("./routes/handlebars.router");

// Connect ATLAS DB
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Conectado a MongoDB Atlas");
    })
    .catch(error => {
        console.error("Error al intentar conectar a MongoDB Atlas: ", error);
    });
    

// Seteo handlebars
app.engine("handlebars", exphbs({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para usar archivos estaticos (js, css)
app.use(express.static(path.join(__dirname, "public")));

// Middleware para analizar JSON
app.use("/api", express.json());
// Middleware para analizar datos de formularios
app.use("/api", express.urlencoded({ extended: true }));

// Puedo usar morgan (logger)
// Multer (subir archivos al servidor)(falta ver)

// Deberá devolver un objeto con el siguiente formato:
/*
{
    status: success/error
    payload: Resultado de los productos solicitados
    totalPages: Total de páginas
    prevPage: Página anterior
    nextPage: Página siguiente
    page: Página actual
    hasPrevPage: Indicador para saber si la página previa existe
    hasNextPage: Indicador para saber si la página siguiente existe.
    prevLink: Link directo a la página previa (null si hasPrevPage=false)
    nextLink: Link directo a la página siguiente (null si hasNextPage=false)
} 
*/
/* 
    Se deberá poder buscar productos por categoría o por disponibilidad, 
    y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio. 
*/
app.get("/", (req, res) => {
    res.send("Bienvenido a el BackEnd de Kevin Alex Muñoz Pascal");
});

app.use("/", handlebarsRouter);

app.use("/api", routes);

module.exports = app;
