'use strict';
const model = require('./model'),
	config = require('./config');

const // helpers
  types = Object.keys((new config.Schema)),
  isType = (type) => types.indexOf(type) > -1 ? true : false,
  log = console.log,
  formats = (new config.Formats).list,
  isFormat = (format) => formats.indexOf(format) > -1 ? true : false,
  unique = (value, index, self) => { return self.indexOf(value) === index; };

var allHeaders = ['_', '_id'];
(function () {
  types.forEach((type) => {allHeaders = allHeaders.concat(Object.keys((new config.Schema)[type]))})
  allHeaders = allHeaders.filter(unique);
})();

const format2csv = (req, res, next) => {
  const stringify = require('csv-stringify/lib/sync')
  let json = res.poc2go.body;
  json.forEach((rec) => {
    Object.keys(rec).forEach((fld) => {
      if (rec[fld] === '') rec[fld] = '(---)';
    })
  })
  return stringify(json,{header: true, columns: allHeaders, delimiter: '\t'})
}


module.exports =
  function view(req, res, next) {
  if (!req.poc2go.params) return next();
  if (req.poc2go.params.format === 'sheet') {
    res.send('<pre>' + format2csv(req, res, next) + '</pre>')
    return;
  }   

  if (res.poc2go.error) {res.poc2go.body = res.poc2go.error;}

  if (typeof res.poc2go.body === 'undefined') { return next() }
  if (typeof res.poc2go.body === 'object') {
    res.poc2go.body = JSON.stringify(res.poc2go.body, null, 2);
  }
  if (typeof res.poc2go.body === 'string') {
    res.format({
      'text/plain': function () {
        res.send(res.poc2go.body)
      },

      'text/html': function () {
        res.send('<div>' + res.poc2go.body + '</div>')
      },

      // To-do: fix above so this works!
      'application/json': function () {
        res.json(res.poc2go.body);
      },

      default: function () {
        // log the request and respond with 406
        res.status(406).send('Mime type requested in Accept header is Not Available')
      }
    })
  }
  else {next()}
};
