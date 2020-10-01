'use strict';
const config = require('./config');

const // helpers
  types = Object.keys((new config.Schema)),
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

var orderformHeaders = [];
(function () {
  types.forEach((type) => {
    if (['company', 'aircraft', 'workorder'].includes(type)) {
      let keys = Object.keys((new config.Schema)[type]);
      for (let i=0; i<keys.length; i++) {
        if (['name','notes'].includes(keys[i])) {
          keys[i] = `${type}_${keys[i]}`;
        } 
      }
      orderformHeaders = orderformHeaders.concat(keys);
    }
  })
  orderformHeaders = orderformHeaders.filter(unique);
  let allUnderbars = orderformHeaders.filter((header) => header[0] === '_');
  orderformHeaders = orderformHeaders.filter((header) => header[0] !== '_');
  orderformHeaders = orderformHeaders.concat(['company_id', 'aircraft_id', 'workorder_id']);
  orderformHeaders = orderformHeaders.concat(allUnderbars);
  orderformHeaders.unshift('_');
})();

exports.format2csv = (req, res, next) => {
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
  return stringify(json,{
    header: true,
    columns: res.poc2go.headers === 'orderforms' ? orderformHeaders : allHeaders,
    delimiter: '\t'})
}
