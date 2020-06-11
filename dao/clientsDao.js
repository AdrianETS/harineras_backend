let constants = require("../utils/constants");
const mysql = require('mysql');
const con = mysql.createConnection(constants.connection);

function getAllClients() {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM clientes", function (err, result, fields) {
            if (err) throw err;
            resolve(result);
          });
    })
}

function getClientById(id) {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM clientes WHERE id = " +  mysql.escape(id), function (err, result, fields) {
            if (err) throw err;
            resolve(result[0]);
          });
    })
}

function getPriceByClientId(id, result) {
    let products = result;
    return new Promise((resolve, reject) => {
        con.query("SELECT id, cliente, nombre_comercial, unidad_medida, img, precio, precioEspecial FROM productos p LEFT JOIN precio_cliente pc ON p.id = pc.producto  WHERE pc.cliente="+  mysql.escape(id), function (err, result, fields) {
            if (err) throw err;
            let modified = calculatePricesOfclientId(products, result);
            resolve(modified);
        });
    })
}

function calculatePricesOfclientId (products, result) {
    result.forEach(element => {
        products[element.id-1].precio = element.precioEspecial;
    });
    return products;
}

module.exports = { getAllClients, getClientById, getPriceByClientId}