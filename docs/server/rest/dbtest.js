
const cl = require('./api/controllers/nedbController');


function tryit() {  return new Promise((resolve, reject) => {
    setTimeout(()=>{resolve(42)}, 5000);
})
}

tryit().then((df)=>console.log(df))


function dberr(err) {
  console.log(err);
  return err;
}

let ccon = new cl.Contact;
let tcon = new cl.Company;
let rcon = new cl.Company;
let econ = new cl.Engine;
let acon = new cl.Aircraft;

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


.catch ((err) => dberr(err));



//(docs)=>console.log('got',typeof docs[0], docs[0], 'Data', tcon.data))
//.catch ((err) => dberr(err));
/*
let acon = new Associate;

acon.change({name: 'An Associate'})
  .then(()=>acon.insert())
  .then(()=>console.log(acon));
*/

/*
 // .then(rtn => console.log('insert',rtn))
//  .then(tcon.change({state: 'Hawaii'}))
//  .then(rtn => console.log('change',rtn))
  .then(()=>{tryit()})
  .then(() => {tcon.data = Object.assign({},tcon.data,{name: 'ffdds'})})
  .then(() => {tcon.update(tcon.data)})
  .then((rtn) => {console.log('update',rtn)});
*/
