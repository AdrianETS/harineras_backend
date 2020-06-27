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
        con.query("SELECT * FROM clientes WHERE id = " + mysql.escape(id), function (err, result, fields) {
            if (err) throw err;
            resolve(result[0]);
        });
    })
}

function getPriceByClientId(id, result) {
    let products = result;
    return new Promise((resolve, reject) => {
        con.query("SELECT id, cliente, nombre_comercial, unidad_medida, img, precio, precioEspecial FROM productos p LEFT JOIN precio_cliente pc ON p.id = pc.producto  WHERE pc.cliente=" + mysql.escape(id), function (err, result, fields) {
            if (err) throw err;
            let modified = calculatePricesOfclientId(products, result);
            resolve(modified);
        });
    })
}

function calculatePricesOfclientId(products, result) {
    result.forEach(element => {
        products[element.id - 1].precio = element.precioEspecial;
    });
    return products;
}

function getRiskIndexByClient(id) {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM riesgos_clientes WHERE id_cliente = " + mysql.escape(id), function (err, result, fields) {
            if (err) throw err;
            console.log(result[0])
            let riskIndex = calculateIndex(result[0])
            console.log(riskIndex);
            resolve(riskIndex);
        });
    })
}

function calculateIndex(dbRiskObject) {
    let iti = 0;
    let tei = 0;
    let ii = 100 - dbRiskObject.indice_impago_cyc;
    let riskIndex = 0;

    if (dbRiskObject.importe_total_impagado <= 10000) {
        iti = 0.01 * dbRiskObject.importe_total_impagado;
    } else {
        iti = 100;
    }
    if (dbRiskObject.tiempo_exceso_impago <= 365) {
        tei = 0.274 * dbRiskObject.tiempo_exceso_impago;
    } else {
        tei = 100;
    }
    riskIndex = 0.4 * iti + 0.4 * tei + 0.2 * ii;
    return riskIndex;
}


module.exports = { getAllClients, getClientById, getPriceByClientId, getRiskIndexByClient }