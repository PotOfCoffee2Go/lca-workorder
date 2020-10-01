'use strict';
const sheet = require('./csvsheets');

module.exports =
  function view(req, res, next) {
  if (!req.poc2go.params) return next();
  if (req.poc2go.params.format === 'sheet') {
    res.send(sheet.format2csv(req, res, next));
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
