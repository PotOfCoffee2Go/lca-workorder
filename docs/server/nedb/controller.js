'use strict';
const model = require('./model'),
	config = require('./config');

const // helpers
  schema = new config.Schema,
  types = Object.keys(schema),
  _subdocs = config._subdocs,
  _required = config._required,
  isType = (type) => types.indexOf(type) > -1 ? true : false,
  makeDbClass = (type) => type[0].toUpperCase() + type.substr(1);

const makeFindQry = (id) => {
  id = id || '{}'; // no id given? - get 'em all!
  let findQry = id;
  if (id[0] === '{') {
    findQry = JSON.parse(id);
    // if field value has a '*' or '?' make into regex expression
    let keys = Object.keys(findQry);
    keys.forEach(fld => {
      if (findQry[fld].indexOf('*') > -1 || findQry[fld].indexOf('?') > -1) { 
        findQry[fld] = findQry[fld].replace(/\*/g,'.*');
        findQry[fld] = findQry[fld].replace(/\?/g,'.');
        findQry[fld] = RegExp(findQry[fld]);
      }
    })
  }
  return findQry;
}

const verify_required = (rec) => {
  

  return true;
}

exports.get_schema = (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  res.poc2go.body = [schema];
  next();
}

exports.get_qry = (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  let id = makeFindQry(req.params.id);
  let dr = new model.DataRecord;
  dr.find(id)
  .then((recs) => {res.poc2go.body = recs; next();})
  .catch((err) => {next(err);})
}

exports.post_qry = async (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  if (req.poc2go.params.format !== 'json') {
    throw "Format for POST /{format}/qry must be 'json'"
  }
  let rec = req.body; 
  let dbClass = makeDbClass(rec.type);
  let dr = new model[dbClass];
  let keys = Object.keys(rec);
  for (const key in keys) { // remove any subdocs
    if (Array.isArray(keys[key]) && key[0] !== '_') { delete keys[key]; }
  }
  dr.setData(rec);
  if (!verify_required(rec)) {
    res.poc2go.body = rec;
    res.poc2go.error = new Error('Missing required field');
  }
  else {
    let ins = await dr.insert(rec);
    dr = new model.DataRecord; // get record without subdocs
    let upd = await dr.find({ _id: ins[0]._id, type: ins[0].type });
    res.poc2go.body = upd;
    console.log('uuu',upd);
  }
  next();
}

exports.put_qry = async (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  if (req.poc2go.params.format !== 'json') {
    throw "Format for PUT /{format}/qry must be 'json'"
  }
  let rec = req.body; 
  let dbClass = makeDbClass(rec.type);
  let dr = new model[dbClass];
  let keys = Object.keys(rec);
  for (const key in keys) { // remove any subdocs
    if (Array.isArray(keys[key]) && key[0] !== '_') { delete keys[key]; }
  }
  dr.setData(rec);
  await dr.update(rec);
  dr = new model.DataRecord; // get record without subdocs
  let upd = await dr.find(rec._id);
  res.poc2go.body = upd;
  next();
}

exports.delete_qry = async (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  if (req.poc2go.params.format !== 'json') {
    throw "Format for PUT /{format}/qry must be 'json'"
  }
  let rec = req.body; 
  let dbClass = makeDbClass(rec.type);
  let dr = new model[dbClass];
  let keys = Object.keys(rec);
  for (const key in keys) { // remove any subdocs
    if (Array.isArray(keys[key]) && key[0] !== '_') { delete keys[key]; }
  }
  dr.setData(rec);
  let rmv = await dr.remove(rec._id);
  res.poc2go.body = rmv;
  next();
}

exports.get_requested_type = (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  if (res.poc2go.body) {next();}
  else if (req.params.format === 'list') {get_list(req, res, next);}
  else if (req.params.format === 'sheet') {get_sheet(req, res, next);}
  else if (isType(req.params.type)) {
    let dbClass = makeDbClass(req.params.type);
    let id = makeFindQry(req.params.id);
    let dr = new model[dbClass];
    dr.find(id)
    .then((recs) => {res.poc2go.body = recs; next();})
    .catch((err) => {next(err);})
  }
  else if (req.params.type === 'orderform') {
    fnOrderForm(req, res, next).then(() => {next();});
  }
  else {next();}
}

const get_list = (req, res, next) => {
  let id = makeFindQry(req.params.id);
  if (req.params.type) id = Object.assign(id, {type: req.params.type ? req.params.type : /.*/});
  let dr = new model.DataRecord;
  dr.find(id, {_id:1, name:1, type:1})
  .then((recs) => {res.poc2go.body = recs; next();})
  .catch((err) => {next(err);})
}

const fnOrderForm = async (req, res, next) => {
  let orderforms = [], co = new model['Company'], ac = new model['Aircraft'];
  let companies = await co.find(req.params.id ? req.params.id : {});

  for (const company of companies) {
    for (const aircraft of company.aircrafts) {
      company.company_name = company.name; company.company_notes = company.notes;
      company.company_id = company._id; aircraft.aircraft_name = aircraft.name;
      aircraft.aircraft_notes = aircraft.notes; aircraft.aircraft_id = aircraft._id;
      orderforms.push(Object.assign({}, company, aircraft, {type: 'orderform'}));
    }
  }

  for (const company of companies) {
    for (const workorder of company.workorders) {
      let aircraft = workorder.aircrafts[0];
      workorder.workorder_name = workorder.name; workorder.workorder_notes = workorder.notes;
      workorder.workorder_id = workorder._id;

      company.company_name = company.name; company.company_notes = company.notes;
      company.company_id = company._id;
      aircraft.aircraft_name = aircraft.name;
      aircraft.aircraft_notes = aircraft.notes;
      aircraft.aircraft_id = aircraft._id;

      orderforms.push(Object.assign({}, company, aircraft, workorder, {type: 'orderform'}));
    }
  }
  res.poc2go.body = orderforms;
}

const linearRecs = (docs, stack) => {
  docs.forEach((doc) => {
    const fields = Object.keys(doc).filter((key) => _subdocs.indexOf(key) > -1);
    fields.forEach((field) => {linearRecs(doc[field], stack); })
    stack.push(doc);
  })
}

const get_sheet = async (req, res, next) => {
  if (req.params.type === 'orderform') {
    await fnOrderForm(req, res, next);
    res.poc2go.headers = 'orderforms';
    return next();
  }
  let linearSubDocs = [];
  let dbClass = makeDbClass(req.params.type);
  let id = makeFindQry(req.params.id);
  let dr = new model[dbClass];
  const recs = await dr.find(id);
  recs.forEach((rec) => {linearSubDocs.push({}); linearRecs([rec], linearSubDocs);});
  linearSubDocs.reverse();
  res.poc2go.headers = 'all';
  res.poc2go.body = linearSubDocs;
  next();
}

const format2json = (req, res, next) => {
  const parse = require('csv-parse/lib/sync')
  let input = req.body;
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
    delimiter: '\t'
  })
  return records;
}

const fnUpdateOrderForm = async (req, res, next) => {
  let curCo = {}, curWo = {};
  let changed = [], linearSubDocs = [];
  let recs = format2json(req, res, next);

  let dr = new model['Workorder'];
  for (const rec of recs) {
    let keys = Object.keys(dr);
    for (const key in dr) {
      if (key === 'name') dr[key] = rec.workorder_name === '(---)' ? '' : rec.workorder_name;
      else if (key === 'notes') dr[key] = rec.workorder_notes === '(---)' ? '' : rec.workorder_notes;
      else if (key === '_company') dr[key] = rec.company_id;
      else if (key === '_aircraft') dr[key] = rec.aircraft_id;
      else dr[key] = rec[key] === '(---)' ? '' : rec[key];
    }
    dr.type = 'workorder';
    await dr.insert();
    await fnOrderForm(req, res, next);
  }
}

const fnUpateByType = async (req, res, next) => {
  let curCo = {}, curWo = {};
  let changed = [], linearSubDocs = [];
  let recs = format2json(req, res, next);
  for (const rec of recs) {
    if (rec.type === 'company') curCo = rec;
    if (rec.type === 'workorder') curWo = rec;
    if (rec._.toLowerCase() === 'u') {
      delete rec._;
      Object.keys(rec).forEach((fld) => {
        if (rec[fld] === '(---)') rec[fld] = '';
        if (fld !== '_id' && typeof schema[rec.type][fld] === 'undefined') delete rec[fld];
        if (fld[0] === '_' && Array.isArray(schema[rec.type][fld])) rec[fld] = rec[fld].split(',');
      })
      let dbClass = makeDbClass(rec.type);
      let dr = new model[dbClass];
      dr.setData(rec);
      await dr.update(rec);
      dr = new model.DataRecord; // get record without subdocs
      let upd = await dr.find(rec._id);
      changed.push(upd[0]);
    }
  }
  res.poc2go.body = changed;
}

exports.post_sheet_update = async (req, res, next) => {
  req.poc2go.params = Object.assign({}, req.params); 
  req.poc2go.params.format = 'sheet';
  if (req.params.type === 'orderform') {
    await fnUpdateOrderForm(req, res, next);
  }
  else {
    await fnUpateByType(req, res, next);
  }
  next();
}
