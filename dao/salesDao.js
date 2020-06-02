let constants = require("../utils/constants");
const mysql = require('mysql');
const con = mysql.createConnection(constants.connection);

//join from 3 tables: products, sales, sale_details. Total price will be displayed in client

function getSaleByClientId(id) {
    return new Promise((resolve, reject) => {
        con.query("SELECT venta.id AS venta, venta.fecha , productos.nombre_comercial AS producto, detalle_venta.cantidad_pedida AS cantidad, detalle_venta.precio_unitario " + 
        "FROM detalle_venta INNER JOIN venta ON venta.id=detalle_venta.id_venta " +
        "INNER JOIN productos ON  detalle_venta.id_producto = productos.id " + 
        "WHERE venta.cliente = " +  mysql.escape(id) +
        " ORDER BY venta.fecha" , function (err, result, fields) {
            if (err) throw err;
            resolve(result);
          });
    })
}

module.exports = {getSaleByClientId}