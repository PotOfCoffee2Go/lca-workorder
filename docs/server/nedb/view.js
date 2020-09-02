
const cl = {} //require('./controller');
const log = console.log;

module.exports =
 function view(req, res, next) {
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

/*



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

*/
