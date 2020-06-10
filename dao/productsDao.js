let constants = require("../utils/constants");
const mysql = require('mysql');
const con = mysql.createConnection(constants.connection);

function getAllProducts() {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM productos", function (err, result, fields) {
            if (err) throw err;
            resolve(result);
          });
    })
}


function getProductById(id) {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM productos WHERE id = " +  mysql.escape(id), function (err, result, fields) {
            if (err) throw err;
            resolve(result);
          });
    })
}



module.exports = {getAllProducts, getProductById}