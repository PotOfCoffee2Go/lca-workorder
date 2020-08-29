const Nedb = require('nedb');
var db = new Nedb({ filename: './databases/test.db', autoload: true }); // localStoreage
//var db = new Nedb(); // memory

class DataRecord {
  constructor() {
    // Defined by derived class
    this.type = '', // 
    this.ref = {},// Working copy of this.keys, defined in derived classes
    this.data = {}// Working copy of this.schema, defined in derived classes
    }

  // Called by derived class to start over fresh
  reset() {
    this.ref = {}; this.data = {};
    Object.assign(this.ref, this.keys);
    Object.assign(this.data, this.schema);
//    this.merge(this.ref, this.keys);
//    this.merge(this.data, this.scheme);
  }

  hasNoRecordId() {
    let err = new Error();
    err.message = 'Not updated! data._id field is required';
    err.key =  '';
    err.errorType = 'NoRecordId';
    return err;
 }
  
  hasRecordId() {
    let err = new Error();
    err.message = 'Not inserted! To insert - data._id needs to be removed first';
    err.key =  '';
    err.errorType = 'HasRecordId';
    return err;
 }
  
  isWrongType(id, dbrecType) {
    if (this.type !== dbrecType) {
      let err = new TypeError();
      err.message = `Found invalid type "${dbrecType}', should be '${this.type}'`;
      err.key =  id;
      err.errorType = 'WrongType'
      return err;
    }
    return null;
  }

  isNotUpdated(id, dbrecType) {
    let err = new Error();
    err.message = 'Not updated! DB returned 0 records updated.';
    err.key =  '';
    err.errorType = 'NotUpdated';
    return err;
 }

  // Get record from the database, given _id(ob)  
  find(id) {
    return new Promise((resolve, reject) => {
      this.reset();
      db.find({ _id: id }, (err, docs) => {
        if (!err) err = this.isWrongType(id, docs[0].type);
        if (err) {reject(err); return;}
        else {
          Object.assign(this.data, docs[0]);
          // get the references to other children records
          Object.keys(this.ref).forEach(ref => {
            this.ref[ref] = this.data[ref];
            if (Array.isArray(this.data[ref])) {
              this.data[ref.substr(1)] = []; // remove the underbar
           }
          })
          resolve(docs);
        }
      })
    }) // Promise
  }
  
  insert(ob) {
    return new Promise((resolve, reject) => {
      //delete this.data._id; // should be done before insert called
      if (this.data._id) {reject(this.hasRecordId());return;}
      let qryInsert = Object.assign({},this.data);
      db.insert(qryInsert, (err, doc) => {
        if (err) {reject(err); return;}
        Object.assign(this.data, doc);
        // Read from database
        this.find(this.data._id).then((fnd) => resolve(fnd), (err) => reject(err));
      })
    }) // Promise
  }

  update(ob,cb) {
    return new Promise((resolve, reject) => {
      if (!this.data._id) {reject(this.hasNoRecordId());return;}
      let qryFind = { _id: this.data._id };
      let qrySet = { $set: this.data };
      db.update(qryFind, qrySet, {}, (err, numReplaced) => {
        if (!err && numReplaced === 0) err = this.isNotUpdated(this.data._id, numReplaced);
        if (err) {reject(err); return;}
        // Read from database
        let id = this.data._id;
        this.find(this.data._id).then((fnd) => resolve(fnd), (err) => reject(err));
      })
    }) // Promise
  }
  
  change(ob) {
    return new Promise((resolve, reject) => {
      Object.assign(this.data, ob);
      console.log(this.data, ob);
      resolve (this.data);
    }) // Promise
  }

  str(ob,cb) {Promise.resolve('');}
  getid(ob,cb) {Promise.resolve(this.data._id);}
  values(ob,cb) {cb(this.data);}
  json(ob,cb){cb(JSON.stringify(this.data,null,2));}
  csv(ob,cb) { cb(`"${this.data._id}","${this.data.name}"`);}
  html(ob,cb){cb('<td>${this.data._id}</td><td>${this.data.name}</td>');}
  doalert(ob,cb){alert(ob);Promise.resolve(ob);}
}

class Company extends DataRecord {
  constructor(){super();this.init()}

  init() {
    this.type = 'company',
    this.keys = {
      _contacts: [],
    },
    this.schema = {
      type: this.type,
      name: '', address: '', city: '', state: '', zip: '',
      phone: '', email: '',
      _contacts: [],
      notes: '',
    }
    super.reset();
  }
}

class Contact extends DataRecord {
  constructor(){super(); this.init()}
  
  init() {
    this.type = 'contact';
    this.keys = {},
    this.schema = {
      type: this.type,
      name: '', address: '', city: '', state: '', zip: '',
      phone: '', email: '',
      notes: '',
    }
    super.reset();
  }
}

function tryit() {  return new Promise((resolve, reject) => {
    setTimeout(()=>{resolve(42)}, 5000);
})
}

tryit().then((df)=>console.log(df))


function dberr(err) {
  console.log({message: err.message, key: err.key, errorType: err.errorType});
  return err;
}

let tcon = new Company;

//tcon.doalert('KIMMY',()=>{})
//tcon.change({name:'kim'})
tcon.find('yfWHqQWkqI4ObhqR')
.then(() => tcon.change({state: 'MN'}))
.then(() => tcon.update())
.then((doc) => {console.log('updated', doc);return doc})
.then((doc)=>console.log('got',typeof doc, doc, 'Data', tcon.data))
.catch ((err) => dberr(err));

/*
 // .then(rtn => console.log('insert',rtn))
//  .then(tcon.change({state: 'Hawaii'}))
//  .then(rtn => console.log('change',rtn))
  .then(()=>{tryit()})
  .then(() => {tcon.data = Object.assign({},tcon.data,{name: 'ffdds'})})
  .then(() => {tcon.update(tcon.data)})
  .then((rtn) => {console.log('update',rtn)});
*/
