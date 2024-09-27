const Product = require("../models/products.model");

/*
    Deberá poder recibir por query params un limit (opcional), una page (opcional), un sort (opcional) y un query (opcional)
    -limit permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.
    page permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1
    query, el tipo de elemento que quiero buscar (es decir, qué filtro aplicar), en caso de no recibir query, realizar la búsqueda general
    sort: asc/desc, para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento

    Deberá devolver un objeto con el siguiente formato:
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

    Se deberá poder buscar productos por categoría o por disponibilidad, 
    y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio. 
*/
exports.getFilteredAndSortedProductPaginate = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const queryParam = req.query.query || null;
        const sortOrder = req.query.sort || null;

        const skip = (page - 1) * limit;

        // Validacion de query
        const query = {};
        if (queryParam) {
            query.$or = [{ category: { $regex: queryParam, $options: "i" } }, { availability: { $regex: queryParam, $options: "i" } }];
        }

        const pipeline = [{ $match: query }];

        // Validacion de sort
        if (sortOrder === "asc") {
            pipeline.push({ $sort: { price: 1 } });
        } else if (sortOrder === "desc") {
            pipeline.push({ $sort: { price: -1 } });
        }

        const payload = await Product.aggregate(pipeline).skip(skip).limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        const prevPage = page - 1;
        const nextPage = page + 1;
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevLink = hasPrevPage ? `?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `?page=${nextPage}&limit=${limit}` : null;

        res.status(200).json({
            status: "success",
            payload,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        console.error("Error al intentar buscar productos", error);
        res.status(500).json({ status: "error", message: "Error al intentar buscar productos" });
    }
};
