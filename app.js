const bodyParser = require('body-parser');
var express = require('express');
var app = express();
const port = 3001;
const cors = require('cors');
let auth = require("./services/auth");

app.use(bodyParser.urlencoded({ extended: true })); app.use(bodyParser.json()); app.use(bodyParser.raw());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

app.post("/login", cors(), (req, res) => {
    auth.login(req, res);
})

app.options('*', cors());