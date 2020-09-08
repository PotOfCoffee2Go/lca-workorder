'use strict';
const model = require('./model'),
	config = require('./config');

const // helpers
  types = Object.keys((new config.Schema)),
  _subdocs = config._subdocs,
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

exports.get_schema = (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  res.poc2go.body = model.read_schema();
  next();
}

exports.get_all = (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  let id = makeFindQry(req.params.id);
  let dr = new model.DataRecord;
  dr.find(id)
  .then((recs) => {res.poc2go.body = recs; next();})
  .catch((err) => {next(err);})
}

exports.get_requested_type = (req, res, next) => {
  req.poc2go.params = Object.assign({},req.params); 
  if (req.params.format === 'list') {get_list(req, res, next);}
  else if (req.params.format === 'sheet') {get_sheet(req, res, next);}
  else if (isType(req.params.type)) {
    let dbClass = makeDbClass(req.params.type);
    let id = makeFindQry(req.params.id);
    let dr = new model[dbClass];
    dr.find(id)
    .then((recs) => {res.poc2go.body = recs; next();})
    .catch((err) => {next(err);})
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

function linearRecs(docs, stack) {
  docs.forEach((doc) => {
    const fields = Object.keys(doc).filter((key) => _subdocs.indexOf(key) > -1);
    fields.forEach((field) => {linearRecs(doc[field], stack); })
    stack.push(doc);
  })
}

const get_sheet = async (req, res, next) => {
  let linearSubDocs = [];
  let dbClass = makeDbClass(req.params.type);
  let id = makeFindQry(req.params.id);
  let dr = new model[dbClass];
  const recs = await dr.find(id);
  recs.forEach((rec) => {linearSubDocs.push({}); linearRecs([rec], linearSubDocs);});
  linearSubDocs.reverse();
  res.poc2go.body = linearSubDocs;
  next();
}
 /* 
  if (isType(req.params.type)) {
    let dbClass = 'DataRecord'; // Get records without subdocs
    let id = makeFindQry(req.params.id);
    let dr = new model[dbClass];
    dr.find(id)
    .then((recs) => {
      let rec = recs[0];
      Object.keys(rec).forEach((key) => {
      if (key[0] === '_') {}
      
      })
    })
    .catch((err) => {next(err);})
  }
  else {next();}
}
    
*/
return;

let ccon = new cl.Contact;
let tcon = new cl.Company;
let rcon = new cl.Company;
let econ = new cl.Engine;
let acon = new cl.Aircraft;
let wcon = new cl.Workorder;
let scon = new cl.Associate;
let kcon = new cl.Task;

console.log('hi');
tcon.change({name:'kim'})
.then(() => tcon.insert())

.then(()=>ccon.change({notes: 'new cl.contact'}))
.then(() => ccon.insert())
.then (() => tcon.attachContact(ccon))

.then (() => rcon.find(tcon._id))
.then(()=>console.log('rcon',rcon))


.then(()=>econ.change({notes: 'new cl.engine'}))
.then (() => econ.insert())
//.then (() => econ.assignAircraft(tcon))
.then(()=>console.log('econ',econ))

.then(()=>acon.change({notes: 'new cl.aircraft'}))
.then (() => acon.insert())
.then (() => acon.assignCompany(tcon))
.then(()=>console.log('acon',acon))

//.then(()=> tcon.find(tcon._id))
//.then((withaircraft)=>{tcon=withaircraft[0]})
.then(()=> console.log('see if aircraft',tcon))

.then (() => econ.assignAircraft(acon))
.then(()=>console.log('econ2',econ))


.then(()=>scon.change({notes: 'new associate'}))
.then(() => scon.insert())

.then(()=>kcon.change({notes: 'new task'}))
.then(() => kcon.insert())
.then (() => kcon.attachAssociate(scon))


.then(()=>wcon.change({notes: 'new workorder'}))
.then (() => wcon.insert())
.then (() => kcon.assignWorkorder(wcon))
.then (() => wcon.assignAircraft(acon))
.then (() => wcon.assignCompany(tcon))
.then(()=>console.log('kcon',kcon))
.then(()=>console.log('wcon',wcon))
.then(()=>console.log('tcon',JSON.stringify(tcon, null, 2)))
.then(()=>tcon.find(tcon._id,{raw:true}))
.then(()=>console.log('tcon-raw',tcon))


.catch ((err) => dberr(err));

