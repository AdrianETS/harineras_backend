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

module.exports = { getAllClients, getClientById }