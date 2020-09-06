// Modified from github project https://github.com/generalgmt/RESTfulAPITutorial

const express = require('express'),
  port = process.env.PORT || 9000,
  app = express(),
  cors = require('cors'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser');

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(favicon('./favicon.ico'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Init the poc2go namespace
app.use( (req, res, next) => {
  req.poc2go = {}; res.poc2go = {}; next();
});

// Routes commands to the controller that
//  calls the database model
//  which returns all results in res.poc2go
const routes = require('./routes');
routes(app);

// Transforms model results to various formats
//  as directed by requested Accept header
const view = require('./view');
app.use(view);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('Workorder API server started port ' + port);
