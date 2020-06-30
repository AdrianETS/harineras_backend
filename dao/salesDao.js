let constants = require("../utils/constants");
const mysql = require('mysql');
const con = mysql.createConnection(constants.connection);

//join from 3 tables: products, sales, sale_details. Total price will be displayed in client

function getSaleByClientId(id) {
    return new Promise((resolve, reject) => {
        con.query("SELECT venta.id AS venta, venta.fecha , productos.nombre_comercial AS producto, detalle_venta.cantidad_pedida AS cantidad, detalle_venta.precio_unitario, cantidad_pedida*precio_unitario AS precio_total " +
            "FROM detalle_venta INNER JOIN venta ON venta.id=detalle_venta.id_venta " +
            "INNER JOIN productos ON  detalle_venta.id_producto = productos.id " +
            "WHERE venta.cliente = " + mysql.escape(id) +
            " ORDER BY venta.fecha", function (err, result, fields) {
                if (err) throw err;
                formatUTCDate(result);
                let convertedResult = calculateTotalPrice(result);
                resolve(convertedResult);
            });
    })
}

function getAllSales() {
    return new Promise((resolve, reject) => {
        con.query("SELECT venta.id AS venta, venta.fecha , productos.nombre_comercial AS producto, detalle_venta.cantidad_pedida AS cantidad, detalle_venta.precio_unitario, cantidad_pedida*precio_unitario AS precio_total " +
            "FROM detalle_venta INNER JOIN venta ON venta.id=detalle_venta.id_venta " +
            "INNER JOIN productos ON  detalle_venta.id_producto = productos.id " +
            " ORDER BY venta.fecha", function (err, result, fields) {
                if (err) throw err;
                formatUTCDate(result);
                resolve(result);
            });
    })
}

function listSales() {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM detalle_venta" , function (err, result, fields) {
            if (err) throw err;
            resolve(result);
          });
    });
}



function calculateTotalPrice(array){
    let totalSumPerSale = 0
    for (let i = 0; i < array.length; i++) {
        if (i != array.length - 1 && array[i].venta == array[i + 1].venta) {
            totalSumPerSale = totalSumPerSale + array[i].precio_total;
            array[i].precio_total_venta = "";
        }
        else {
            totalSumPerSale = totalSumPerSale + array[i].precio_total
            array[i].precio_total_venta = totalSumPerSale;
            totalSumPerSale = 0;
        }
    }
    return array;
}

function formatUTCDate(sales) {
    sales.map(sale => {
        var d = sale.fecha;
        var currentDate = d.getDate();
        var currentMonth = d.getMonth() + 1; //Months are zero based
        var currentYear = d.getFullYear();
        sale.fecha = currentDate + "-" + currentMonth + "-" + currentYear;
        return sale;
    });
}


function insertSaleInSales(sale) {
    return new Promise((resolve, reject) => {
        let today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        con.query("INSERT INTO venta (fecha, cliente) VALUES (\'" + yyyy + '-' + mm + '-' + dd + "'\, \'" + sale.cliente + "'\)", function (err, result, fields) {
            if (err) throw err;
            resolve(result);
        });
    })
}

function insertSaleInSalesDetails(dataFromSale, id) {
    let query = "INSERT INTO detalle_venta (id_venta, id_producto, cantidad_pedida, precio_unitario) VALUES ?";
    let values = dataFromSale.map(data => {
        let row = [];
        row.push(id, data.id, data.cantidad, data.precio);
        return row;
    })
    return new Promise((resolve, reject) => {
        con.query(query, [values], function (err, result, fields) {
            console.log(values);
            if (err) throw err;
            resolve(result);
        });
    })
}


module.exports = { getSaleByClientId, insertSaleInSales, insertSaleInSalesDetails, listSales, getAllSales }
