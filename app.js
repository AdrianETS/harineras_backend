const bodyParser = require('body-parser');
var express = require('express');
var app = express();
const port = 3001;
const cors = require('cors');
let auth = require("./services/auth");
let clientsDao = require("./dao/clientsDao")

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

app.get('/clients/:id', cors(), (req, res) => {
  auth.checkToken(req.query.token)
    .then(result => clientsDao.getClientById(req.params.id))
    .then(client => res.send(client))
    .catch(() => res.status(401).json({
      error: 'Unauthorized'
    }));
});

app.post("/login", cors(), (req, res) => {
  auth.login(req, res);
})

app.options('*', cors());