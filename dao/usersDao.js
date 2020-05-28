let constants = require("../utils/constants");
const mysql = require('mysql');
const con = mysql.createConnection(constants.connection);
const bcrypt = require('bcrypt');
const saltRounds = 10;


function insertUser(newUser) {
    return new Promise((resolve, reject) => {
        newUser.password = bcrypt.hashSync(newUser.password, saltRounds);
        let insertQuery = "INSERT INTO usuarios (user, password) VALUES (\'" + newUser.user + "'\, \'" + newUser.password + "'\)";
            con.query(insertQuery, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted, ID: " + result.insertId);
                resolve(result)
            });
        
    })
}

function checkIfUserExistsInDb(user) {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM usuarios WHERE user = " + mysql.escape(user), function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                reject({ error: "User already exists in DB" });
            } else {
                resolve(result);
            }

        });

    })
}

function login(user, password) {
    return new Promise((resolve, reject) => {

        con.query("SELECT * FROM usuarios WHERE user = " + mysql.escape(user),
            function (err, result) {
                if (err) throw err;
                if (result.length != 0 && bcrypt.compareSync(password, result[0].password)) {
                    resolve(result);
                } else {
                    reject({ error: "Login not successful" });
                }
            });

    })
}

module.exports = { login, insertUser }