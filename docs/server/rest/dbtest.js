const Nedb = require('nedb');
var db = new Nedb({ filename: './databases/test.db', autoload: true }); // localStoreage
//var db = new Nedb(); // memory

class DataRecord {
  constructor() {
    // Defined by derived class
    this.type = '', // 
    this.data = {}// Working copy of this.schema, defined in derived classes
    }

  // Called by derived class to start over fresh
  reset() {
    this.data = Object.assign({}, this.schema);
//    this.merge(this.ref, this.keys);
//    this.merge(this.data, this.scheme);
  }

  // Errors
  
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

  // Database acccess

  // Get record from the database, given _id(ob)  
  find(id) {
    return new Promise((resolve, reject) => {
      if (typeof id === 'string') id = [id];
      db.find({_id: {$in: id }}, (err, docs) => {
        if (err) {reject(err); return;}
        docs.forEach(doc => {
          this.reset();
          if ((err = this.isWrongType(doc._id, doc.type))) {reject(err);return;};
          Object.assign(this.data, doc);
        })
        this.insertSubDocs().then(()=>resolve(docs), (err)=>reject(err));
      })
    }) // Promise
  }

  insert(ob) {
    return new Promise((resolve, reject) => {
      //delete this.data._id; // should be done before insert called
      if (this.data._id) {reject(this.hasRecordId());return;}
      let qryInsert = Object.assign({},this.data);
      this.removeSubDocs(); // get rid of subdoc data - just keep the keys
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
      this.removeSubDocs(); // get rid of subdoc data - just keep the keys
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

  insertSubDocs() {
    return new Promise((resolve, reject) => {
      let contact = new Contact;
      console.log('company-popsubdoc',this.data._contacts);
      contact.find(this.data._contacts)
        .then((docs) => {this.data.contacts = docs})
        .then(() => resolve(null))
        .catch((err) => reject(err));
    })
  }

  removeSubDocs() {
    if (typeof this.data.contacts !==  undefined) {
      let _contacts = [];
      // Grab the DB keys just in case contact(s) added/removed
      this.data.contacts.forEach(contact => {
        _contacts.push(contact._id);
      })
      this.data._contacts = _contacts;
      // Now have the keys, delete the related data
      delete this.data.contacts;
    }
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

  insertSubDocs() {
    return new Promise((resolve, reject) => {
      // Get any sub-documents
      console.log('contact-popsubdoc',this.data._contacts);
      resolve(null);
    })
  }

  removeSubDocs() {}

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
//.then(() => tcon.change({state: 'MN'}))
//.then(() => tcon.update())
//.then((doc) => {console.log('updated', doc);return doc})
.then((docs)=>console.log('got',typeof docs[0], docs[0], 'Data', tcon.data))
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
