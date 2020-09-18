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

var allHeaders = ['_id'];
(function () {
  types.forEach((type) => {allHeaders = allHeaders.concat(Object.keys((new config.Schema)[type]))})
  allHeaders = allHeaders.filter(unique);
  let allUnderbars = allHeaders.filter((header) => header[0] === '_');
  allHeaders = allHeaders.filter((header) => header[0] !== '_');
  allHeaders = allHeaders.concat(allUnderbars);
  allHeaders.unshift('_');
})();

const format2csv = (req, res, next) => {
  const stringify = require('csv-stringify/lib/sync')
  let json = res.poc2go.body;
  json.forEach((rec) => {
    Object.keys(rec).forEach((fld) => {
      if (rec[fld] === '') rec[fld] = '(---)';
      if (fld[0] === '_' && Array.isArray(rec[fld])) {
        rec[fld] = rec[fld].join(',');
      }
    })
  })
  return stringify(json,{header: true, columns: allHeaders, delimiter: '\t'})
}


module.exports =
  function view(req, res, next) {
  if (!req.poc2go.params) return next();
  if (req.poc2go.params.format === 'sheet') {
    res.send(format2csv(req, res, next));
    return;
  }   

  if (res.poc2go.error) {res.poc2go.body = res.poc2go.error;}

  if (typeof res.poc2go.body === 'undefined') { return next() }
  if (typeof res.poc2go.body === 'object') {
    res.json(res.poc2go.body);
    return;
//    res.poc2go.body = JSON.stringify(res.poc2go.body, null, 2);
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
        res.send(res.poc2go.body);
      },

      default: function () {
        // log the request and respond with 406
        res.status(406).send('Mime type requested in Accept header is Not Available')
      }
    })
  }
  else {next()}
};
