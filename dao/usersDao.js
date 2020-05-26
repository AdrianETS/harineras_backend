let constants = require("../utils/constants");
const mysql = require('mysql');
const con = mysql.createConnection(constants.connection);

function login(user, password) {
    return new Promise((resolve, reject) => {
            con.query("SELECT * FROM usuarios WHERE user = " + mysql.escape(user) + "AND password = " + mysql.escape(password), 
            function (err, result) {
                if (err) throw err;
                if(result.length !=0){
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        
    })
}

module.exports = { login }