const Nedb = require('nedb');
var db = new Nedb({ filename: './databases/test.db', autoload: true }); // localStoreage
//var db = new Nedb(); // memory
class Schema {
  constructor() {this.init();}

  init() { Object.assign(this, {
    company: { 
      type: 'company',
      name: '', address: '', city: '', state: '', zip: '',
      phone: '', email: '',
      _contacts: [],
      contacts: [],
      notes: '',
    },
    contact: { 
      type: 'contact',
      name: '', address: '', city: '', state: '', zip: '',
      phone: '', email: '',
      notes: '',
    },
    associate: { 
      type: 'associate',
      name: '', address: '', city: '', state: '', zip: '',
      phone: '', email: '',
      notes: '',
    },
  })}
}

const schema = new Schema;

class DataRecord {
  constructor() {}

  // Called by derived class to start over fresh
  reset() { Object.assign(this, this.getSchema()) }

  setData(doc) { Object.assign(this, doc); }

  // filter array to be unique
  unique(value, index, self) {
    return self.indexOf(value) === index;
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
        this.insertSubDocs(docs)
          .then((dbRecs)=>resolve(dbRecs), (err)=>reject(err));
      })
    }) // Promise
  }

  insert(ob) {
    return new Promise((resolve, reject) => {
      //delete this.data._id; // should be done before insert called
      if (this._id) {reject(this.hasRecordId());return;}
      this.removeSubDocs(); // get rid of subdoc data - just keep the keys
      let qryInsert = Object.assign({},this);
      db.insert(qryInsert, (err, doc) => {
        if (err) {reject(err); return;}
        this.find(doc._id)
          .then((dbRec) => resolve(dbRec), (err) => reject(err));
      })
    }) // Promise
  }

  update(ob,cb) {
    return new Promise((resolve, reject) => {
      if (!this._id) {reject(this.hasNoRecordId());return;}
      let qryFind = { _id: this._id };
      this.removeSubDocs(); // get rid of subdoc data - just keep the keys
      let qrySet = { $set: this };
      db.update(qryFind, qrySet, {}, (err, numReplaced) => {
        if (!err && numReplaced === 0) err = this.isNotUpdated(this._id, numReplaced);
        if (err) {reject(err); return;}
        this.find(this._id)
          .then((dbRec) => resolve(dbRec), (err) => reject(err));
      })
    }) // Promise
  }
  
  change(ob) {
    return new Promise((resolve, reject) => {
      Object.assign(this, ob);
      console.log(this, ob);
      resolve (this);
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
    super.reset();
  }

  getSchema() {return schema.company;}

  // Insert the contact sub-docs
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      let companies = [];
      console.log('docs',docs);
      docs.forEach((doc) => {
        let company = new Company;
        companies.push(company);
        company.setData(doc);
        let contact = new Contact;
        console.log('company-popsubdoc',doc._contacts);
        contact.find(company._contacts)
          .then((contactdocs) => {company.contacts = contactdocs})
          .catch((err) => reject(err));
      })
      resolve(companies);
    })
  }

  // Remove the contact sub-docs
  removeSubDocs() {
    if (typeof this.contacts !==  undefined) {
      this._contacts = [];
      // Grab the DB keys just in case contact(s) added/removed
      this.contacts.forEach(contact => {
        this._contacts.push(contact._id);
      })
      // Now have the keys, delete the related data
      delete this.contacts;
    }
  }

  attach(dbrec) {
    return new Promise((resolve, reject) => {
      this._contacts.push(dbrec._id);
      this._contacts = this._contacts.filter(this.unique);
      console.log('this', this);
      this.update()
        .then(() => this.find(this._id))
        .then((dbRecs)=>resolve(dbRecs), (err)=>reject(err));
    })
  }

  detach(dbrec) {
    return new Promise((resolve, reject) => {
      let idx = this._contacts.indexOf(dbrec._id);
      if (idx > -1) this._contacts.splice(idx,1);
      this.find(this._id)
        .then((dbRecs)=>resolve(dbRecs), (err)=>reject(err));
    })
  }

}


class Contact extends DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.contact;}

  // Contacts have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      let contacts = [];
      docs.forEach((doc) => {
        let contact = new Contact;
        contacts.push(contact);
        contact.setData(doc);
      })
      resolve(contacts);
    })
  }

  // Contacts has no sub-docs to remove
  removeSubDocs() {}

}

class Associate extends DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.associate;}

  // Associates have no sub-docs - so just return
  insertSubDocs() {
    return new Promise((resolve, reject) => {
      let associates = [];
      docs.forEach((doc) => {
        let associate = new Associate;
        associates.push(associate);
        associate.setData(doc);
      })
      resolve(associates);
    })
  }

  // Associates has no sub-docs to remove
  removeSubDocs() {}

}

function tryit() {  return new Promise((resolve, reject) => {
    setTimeout(()=>{resolve(42)}, 5000);
})
}

tryit().then((df)=>console.log(df))


function dberr(err) {
  console.log(err);
  return err;
}

let ccon = new Contact;
let tcon = new Company;

tcon.change({name:'kim'})
.then(() => tcon.insert())
.catch ((err) => dberr(err));


ccon.change({notes: 'new contact'})
.then(() => ccon.insert())
.then (() => tcon.attach(ccon))
.then ((dbrec) => {tcon = dbrec})
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
