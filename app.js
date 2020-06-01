const bodyParser = require('body-parser');
var express = require('express');
var app = express();
const port = 3001;
const cors = require('cors');
let auth = require("./services/auth");
let clientsDao = require("./dao/clientsDao");
let productsDao = require("./dao/productsDao");
let usersDao = require("./dao/usersDao");
let salesDao = require("./dao/salesDao");

app.use(bodyParser.urlencoded({ extended: true })); app.use(bodyParser.json()); app.use(bodyParser.raw());

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/clients/list', cors(), (req, res) => {
  auth.checkToken(req.query.token)
    .then(result => clientsDao.getAllClients())
    .then(clients => res.send(clients))
    .catch(() => res.status(401).json({
      error: 'Unauthorized'
    }));
});

app.get('/products/list', cors(), (req, res) => {
  auth.checkToken(req.query.token)
    .then(result => productsDao.getAllProducts())
    .then(products => res.send(products))
    .catch(() => res.status(401).json({
      error: 'Unauthorized'
    }));
});

app.get('/clients/:id', cors(), (req, res) => {
  auth.checkToken(req.query.token)
    .then(result => clientsDao.getClientById(req.params.id))
    .then(client => res.send(client))
    .catch(() => res.status(401).json({
      error: 'Unauthorized'
    }));
});

app.get('/products/:id', cors(), (req, res) => {
  auth.checkToken(req.query.token)
    .then(result => productsDao.getProductById(req.params.id))
    .then(product => res.send(product))
    .catch(() => res.status(401).json({
      error: 'Unauthorized'
    }));
});

app.get('/sales/:id', cors(), (req, res) => {
  auth.checkToken(req.query.token)
    .then(result => salesDao.getSaleByClientId(req.params.id))
    .then(sales => res.send(sales))
    .catch(() => res.status(401).json({
      error: 'Unauthorized'
    }));
});

app.post("/users", cors(), (req, res) => {
  auth.checkToken(req.query.token)
  .then(result => usersDao.insertUser(req.body))
  .then(result => res.send(result))
  .catch(() => res.status(401).json({
    error: 'Unauthorized'
  }));
})

app.post("/login", cors(), (req, res) => {
  auth.login(req, res);
})

app.options('*', cors());