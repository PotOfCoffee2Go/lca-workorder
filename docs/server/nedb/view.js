'use strict';
const model = require('./model'),
	config = require('./config');

const // helpers
  types = Object.keys((new config.Schema)),
  isType = (type) => types.indexOf(type) > -1 ? true : false,
  log = console.log,
  formats = (new config.Formats).list,
  isFormat = (format) => formats.indexOf(format) > -1 ? true : false;

const formatcsv2 = (json) => {
const stringify = require('csv-stringify/lib/sync')

return stringify(json,{
  header: true,
  columns: ['_id'].concat(Object.keys((new config.Schema)[json[0].type]))
})
}


module.exports =
  function view(req, res, next) {
    res.send('<pre>' + formatcsv2(res.poc2go.body) + '</pre>')

   
    return; 
  if (res.poc2go.error) {res.poc2go.body = res.poc2go.error;}

  if (typeof res.poc2go.body === 'undefined') { return next() }
  if (typeof res.poc2go.body === 'object') {
//    res.poc2go.body = '<pre>' + JSON.stringify(res.poc2go.body, null, 2) + '</pre>';
  }
  if (typeof res.poc2go.body === 'string') {
    res.format({
      'text/plain': function () {
        res.send(res.poc2go.body)
      },

      'text/html': function () {
        res.send('<pre>' + formatcsv(res.poc2go.body) + '</pre>')
//        res.send('<div>' + res.poc2go.body + '</div>')
      },

      'application/json': function () {
        res.send({ message: res.poc2go.body })
      },

      default: function () {
        // log the request and respond with 406
        res.status(406).send('Mime type requested in Accept header is Not Available')
      }
    })
  }
  else {next()}
};
