const express = require("express");
const app = express();
const routes = require("./routes");
const path = require("path");
const appController = require("./controllers/appController");

// Coneccion de mongoose
const connectDB = require("./config/database");

// Requierimientos de Handlebars
const exphbs = require("express-handlebars");
const handlebarsRouter = require("./routes/handlebars.router");

// Seteo handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para usar archivos estaticos (js, css)
app.use(express.static(path.join(__dirname, "public")));

// Middleware para analizar JSON
app.use("/api", express.json());
// Middleware para analizar datos de formularios
app.use("/api", express.urlencoded({ extended: true }));

/* 
    Se deberá poder buscar productos por categoría o por disponibilidad, 
    y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio. 
    Ademas tiene su paginacion correspondiente
*/
app.get("/", appController.getFilteredAndSortedProductPaginate);

app.use("/", handlebarsRouter);

app.use("/api", routes);

module.exports = app;
