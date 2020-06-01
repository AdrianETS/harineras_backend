let constants = require("../utils/constants");
const mysql = require('mysql');
const con = mysql.createConnection(constants.connection);

function getSaleByClientId(id) {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM venta WHERE cliente = " +  mysql.escape(id), function (err, result, fields) {
            if (err) throw err;
            resolve(result);
          });
    })
}

module.exports = {getSaleByClientId}