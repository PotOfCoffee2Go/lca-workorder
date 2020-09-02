// Modified from github project https://github.com/generalgmt/RESTfulAPITutorial

const express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 9000,
  bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Controller (req.poc2go and res.poc2go)
//  have vars/functions to control app
const controller = require('./controller');
app.use(controller);

// Routes commands to the database model
//  which returns all results in JSON
const routes = require('./routes');
routes(app);

// Transforms model results to various formats
//  as directed by controller
const view = require('./view');
app.use(view);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('Workorder API server started port ' + port);
