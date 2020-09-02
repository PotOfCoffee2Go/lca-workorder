
const cl = require('./nedbController');



exports.read_all = function(req, res) {
  let apireq = req.body;
  let query = {};
  db.find({}, (err, fndDocs) => {
    if (err) { res.send(err); }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(fndDocs, null, 2));
// res.json(fndDocs);
  });
}




function dberr(err) {
  console.log(err);
  return err;
}

function makeRegexp(field) {
  let hasWildcard = /(.*\*.*)/.exec(field);
  console.log(hasWildcard);
}


makeRegexp('no so');
makeRegexp('is*so*');


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

