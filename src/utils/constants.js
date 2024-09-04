// TODO:
const dataPath = "./data"

const productsFilePath = dataPath + "/products.json";

const cartsFilePath = dataPath + "/carts.json";

const emptyProduct = {
    id: undefined,
    title : undefined,
    description : undefined,
    code : undefined,
    price : undefined,
    status : undefined,
    stock : undefined,
    category : undefined,
    thumbnails : undefined
}

const constants = {
    cartsFilePath,
    productsFilePath
}

module.exports = constants;