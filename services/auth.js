let usersDao = require("../dao/usersDao");
let constants = require("../utils/constants");
const mysql = require('mysql');
var con = mysql.createConnection(constants.connection);
var jwt = require('jsonwebtoken');

function login(req, res) {
    console.log("Password: " + req.body.password);
    console.log("User: " + req.body.user);
    usersDao.login(req.body.user, req.body.password)
        .then(user => {
            let token = jwt.sign({ id: user._id }, "My_secret", {
                expiresIn: 86400
            });
            res.status(200).send({ auth: true, token: token});
        })
        .catch(err => {
            res.status(401).send({ auth: false, err })
        })
}


function checkToken(token){
    return new Promise((resolve,reject) =>{
        jwt.verify(token, "My_secret", function (err, decoded) {
            if (err || !token) {
                reject(["Unauthorized", 401]);
            } else {
                resolve();
            }
        });
    })
}

module.exports = { login, checkToken }
