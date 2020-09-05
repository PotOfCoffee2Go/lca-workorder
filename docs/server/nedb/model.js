const config = require('./config');
const schema = new config.Schema;
const Nedb = require('nedb');
var db = new Nedb({ filename: './databases/test.db', autoload: true, timestampData: true }); // localStoreage

//module.exports = function () {
  
exports.read_schema = () => { return schema; }  
  
exports.DataRecord = class DataRecord {
  constructor() {}

  // Called by derived class to start over fresh
  reset() { Object.assign(this, this.getSchema()) }

  setData(doc) { Object.assign(this, doc); }

  // Accept any record type
  getSchema() {return {type: /.*/}}


  // Overloaded by derived class
  insertSubDocs(docs) {return Promise.resolve(docs);};

  removeSubDocs() {
    delete this.contacts;
    delete this.associates;
    delete this.engines;
    delete this.aircrafts;
    delete this.tasks;
    delete this.workorders;
  }


  // filter array to be unique
  unique(value, index, self) { return self.indexOf(value) === index; }


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

  isInvalidType(id, got, needed) {
    let err = new Error();
    err.message = `Not asssigned! Invalid record type '${got}'! needed '${needed}'.`;
    err.key =  id;
    err.errorType = 'InvalidType';
    return err;
  }


  // Database acccess

  // Get record from the database, given _id(ob)  
  find(id, opts = {}) {
    return new Promise((resolve, reject) => {
      let qry = {};
      if (typeof id === 'string') id = [id];
      if (Array.isArray(id)) qry = {_id: {$in: id }}; else qry = id;
      qry.type = this.getSchema().type;
      db.find(qry, (err, docs) => {
        if (err) {return reject(err);}
        /*if (opts.raw) { // use class DataRecords for raw records
          this.removeSubDocs();
          this.setData(docs[0]);
          return resolve([this]);
        }*/
        this.insertSubDocs(docs)
          .then((dbRecs)=>resolve(dbRecs));
      })
    }) // Promise
  }

  insert(opts = {}) {
    return new Promise((resolve, reject) => {
      //delete this.data._id; // should be done before insert called
      if (this._id) {return reject(this.hasRecordId());}
      this.removeSubDocs(); // get rid of subdoc data - just keep the keys
      let qryInsert = Object.assign({},this);
      db.insert(qryInsert, (err, doc) => {
        if (err) {return reject(err);}
        this.find(doc._id, opts)
          .then((dbRec) => resolve(dbRec));
      })
    }) // Promise
  }

  update(opts = {}) {
    return new Promise((resolve, reject) => {
      if (!this._id) {return reject(this.hasNoRecordId())}
      let qryFind = { _id: this._id };
      this.removeSubDocs(); // get rid of subdoc data - just keep the keys
      let qrySet = { $set: this };
      db.update(qryFind, qrySet, {}, (err, numReplaced) => {
        if (!err && numReplaced === 0) err = this.isNotUpdated(this._id, numReplaced);
        if (err) {return reject(err);}
        this.find(this._id, opts)
          .then((dbRec) => resolve(dbRec));
      })
    }) // Promise
  }
  
  change(fields) {
    return new Promise((resolve, reject) => {
      Object.assign(this, fields);
      resolve (this);
    })
  }


  str(ob,cb) {Promise.resolve('');}
  getid(ob,cb) {Promise.resolve(this.data._id);}
  values(ob,cb) {cb(this.data);}
  json(ob,cb){cb(JSON.stringify(this.data,null,2));}
  csv(ob,cb) { cb(`"${this.data._id}","${this.data.name}"`);}
  html(ob,cb){cb('<td>${this.data._id}</td><td>${this.data.name}</td>');}
  doalert(ob,cb){alert(ob);Promise.resolve(ob);}

}

exports.Company = class Company extends exports.DataRecord {
  constructor(){super();this.init()}

  init() { super.reset(); }

  getSchema() {return schema.company;}

  // Insert the contact sub-docs
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      if (docs.length === 0) return resolve(docs);
      let companies = [];
      docs.forEach((doc, idx) => {
        let company = new Company;
        company.setData(doc);
        companies.push(company);
        Promise.all([
         // Array References to contacts
          (new exports.Contact).find(company._contacts)
            .then((sdocs) => {company.contacts = sdocs}),
          // workorders and aircraft have a single reference a company
          (new exports.Workorder).find({ _company: company._id, type: 'workorder' })
            .then((sdocs) => {company.workorders = sdocs}),
          (new exports.Aircraft).find({ _company: company._id, type: 'aircraft' })
            .then((sdocs) => {company.aircrafts = sdocs}),
          ])
          .then(()=>this.setData(companies[0]))
          .then(()=>{if (idx+1 === docs.length) resolve(companies)})
          .catch((err) => reject(err));
      })
    })
  }

  attachContact(dbrec) {
    return new Promise((resolve, reject) => {
      this._contacts.push(dbrec._id);
      this._contacts = this._contacts.filter(this.unique);
      this.update()
        .then((dbRecs)=>resolve(dbRecs));
    })
  }

  detachContact(dbrec) {
    return new Promise((resolve, reject) => {
      let idx = this._contacts.indexOf(dbrec._id);
      if (idx > -1) this._contacts.splice(idx,1);
      this.find(this._id)
        .then((dbRecs)=>resolve(dbRecs));
    })
  }

}


exports.Contact = class Contact extends exports.DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.contact;}

  // Contacts have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      if (docs.length === 0) return resolve(docs);
      let contacts = [];
      docs.forEach((doc) => {
        let contact = new Contact;
        contacts.push(contact);
        contact.setData(doc);
      })
      this.setData(contacts[0]);
      resolve(contacts);
    })
  }

}

exports.Associate = class Associate extends exports.DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.associate;}

  // Associates have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      if (docs.length === 0) return resolve(docs);
      let associates = [];
      docs.forEach((doc) => {
        let associate = new Associate;
        associates.push(associate);
        associate.setData(doc);
      })
      this.setData(associates[0]);
      resolve(associates);
    })
  }
}

exports.Engine = class Engine extends exports.DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.engine;}

  // Engines have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      if (docs.length === 0) return resolve(docs);
      let engines = [];
      docs.forEach((doc) => {
        let engine = new Engine;
        engines.push(engine);
        engine.setData(doc);
      })
      this.setData(engines[0]);
      resolve(engines);
    })
  }

  assignAircraft(dbrec) {
    return new Promise((resolve, reject) => {
      if (dbrec.type !== 'aircraft') {
        return reject(this.isInvalidType(dbrec._id, dbrec.type, 'aircraft'));
      }
      this._aircraft = dbrec._id;
      this.update()
        .then(() => dbrec.update())
        .then(() => resolve(this));
    })
  }
}

exports.Aircraft = class Aircraft extends exports.DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.aircraft;}

  // Aircraft have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      if (docs.length === 0) return resolve(docs);
      let aircrafts = [];
      docs.forEach((doc, idx) => {
        let aircraft = new Aircraft;
        aircraft.setData(doc);
        aircrafts.push(aircraft);
        Promise.all([
          (new exports.Engine).find({_aircraft: aircraft._id, type: 'engine'})
            .then((sdocs) => {aircraft.engines = sdocs}),
        ])
        .then(()=>this.setData(aircrafts[0]))
        .then(()=>{if (idx+1 === docs.length) resolve(aircrafts)})
        .catch((err) => reject(err));
      })
    })
  }

  assignCompany(dbrec) {
    return new Promise((resolve, reject) => {
      if (dbrec.type !== 'company') {
        return reject(this.isInvalidType(dbrec._id, dbrec.type, 'company'));
      }
      this._company = dbrec._id;
      this.update()
        .then(() => dbrec.update())
        .then(() => resolve(this));
    })
  }
}

exports.Task = class Task extends exports.DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.task;}

  // Insert the contact sub-docs
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      if (docs.length === 0) return resolve(docs);
      let tasks = [];
      docs.forEach((doc, idx) => {
        let task = new Task;
        task.setData(doc);
        tasks.push(task);
        Promise.all([
          (new exports.Associate).find(task._associates)
            .then((sdocs) => {task.associates = sdocs}),
        ])
        .then(()=>this.setData(tasks[0]))
        .then(()=>{if (idx+1 === docs.length) resolve(tasks)})
        .catch((err) => reject(err));
      })
    })
  }

  assignWorkorder(dbrec) {
    return new Promise((resolve, reject) => {
      if (dbrec.type !== 'workorder') {
        return reject(this.isInvalidType(dbrec._id, dbrec.type, 'workorder'));
      }
      this._workorder = dbrec._id;
      this.update()
        .then(() => dbrec.update())
        .then(() => resolve(this));
    })
  }

  attachAssociate(dbrec) {
    return new Promise((resolve, reject) => {
      this._associates.push(dbrec._id);
      this._associates  = this._associates.filter(this.unique);
      this.update()
        .then((dbRecs)=>resolve(dbRecs));
    })
  }

  detachAssociate(dbrec) {
    return new Promise((resolve, reject) => {
      let idx = this._associates.indexOf(dbrec._id);
      if (idx > -1) this._associates.splice(idx,1);
      this.find(this._id)
        .then((dbRecs)=>resolve(dbRecs));
    })
  }
}

exports.Workorder = class Workorder extends exports.DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.workorder;}

  // Workorder have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      if (docs.length === 0) return resolve(docs);
      let workorders = [];
      docs.forEach((doc, idx) => {
        let workorder = new Workorder;
        workorder.setData(doc);
        workorders.push(workorder);
        Promise.all([
          (new exports.Task).find({_workorder: workorder._id, type: 'task'})
            .then((sdocs) => {workorder.tasks = sdocs}),
          ])
          .then(()=>this.setData(workorders[0]))
          .then(()=>{if (idx+1 === docs.length) resolve(workorders)})
          .catch((err) => reject(err));
      })
    })
  }

  assignCompany(dbrec) {
    return new Promise((resolve, reject) => {
      if (dbrec.type !== 'company') {
        return reject(this.isInvalidType(dbrec._id, dbrec.type, 'company'));
      }
      this._company = dbrec._id;
      this.update()
        .then(() => dbrec.update())
        .then(() => resolve(this));
    })
  }

  assignAircraft(dbrec) {
    return new Promise((resolve, reject) => {
      if (dbrec.type !== 'aircraft') {
        return reject(this.isInvalidType(dbrec._id, dbrec.type, 'aircraft'));
      }
      this._aircraft = dbrec._id;
      this.update()
        .then(() => dbrec.update())
        .then(() => resolve(this));
    })
  }
}

//} // module.exports 
