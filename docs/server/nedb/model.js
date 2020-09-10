const config = require('./config');
const schema = new config.Schema;
const Nedb = require('nedb');
var db = new Nedb({ filename: './databases/test.db', autoload: true, timestampData: true }); // localStoreage

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
  find(id, prj = {}) {
    return new Promise((resolve, reject) => {
      let qry = {};
      if (typeof id === 'string') id = [id];
      if (Array.isArray(id)) qry = {_id: {$in: id }}; else qry = id;
      if (!qry.type) qry.type = this.getSchema().type;
      db.find(qry, prj, (err, docs) => {
        if (err) {return reject(err);}
        this.insertSubDocs(docs)
          .then((dbRecs)=>resolve(dbRecs));
      })
    }) // Promise
  }

  insert() {
    return new Promise((resolve, reject) => {
      //delete this.data._id; // should be done before insert called
      if (this._id) {return reject(this.hasRecordId());}
      this.removeSubDocs(); // get rid of subdoc data - just keep the keys
      let qryInsert = Object.assign({},this);
      db.insert(qryInsert, (err, doc) => {
        if (err) {return reject(err);}
        this.find(doc._id)
          .then((dbRec) => resolve(dbRec));
      })
    }) // Promise
  }

  update() {
    return new Promise((resolve, reject) => {
      if (!this._id) {return reject(this.hasNoRecordId())}
      let qryFind = { _id: this._id };
      this.removeSubDocs(); // get rid of subdoc data - just keep the keys
      let qrySet = { $set: this };
      db.update(qryFind, qrySet, {}, (err, numReplaced) => {
        if (!err && numReplaced === 0) err = this.isNotUpdated(this._id, numReplaced);
        if (err) {return reject(err);}
        this.find(this._id)
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
  async insertSubDocs(docs) {
    if (docs.length === 0) return docs;
    let companies = [];
    for (const doc of docs) {
      let company = new Company;
      Object.assign(doc,{contacts: [], aircrafts: [], workorders: []});
      company.setData(doc);
      await Promise.all([
       // Array References to contacts
        (new exports.Contact).find(company._contacts)
          .then((sdocs) => {company.contacts = sdocs}),
        // workorders and aircraft have a single reference a company
        (new exports.Workorder).find({ _company: company._id, type: 'workorder' })
          .then((sdocs) => {company.workorders = sdocs}),
        (new exports.Aircraft).find({ _company: company._id, type: 'aircraft' })
          .then((sdocs) => {company.aircrafts = sdocs}),
        ])
        .then(()=>companies.push(company))
        .catch((err) => reject(err));
    }
    this.setData(companies[0]);
    return companies;
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
  async insertSubDocs(docs) {
    if (docs.length === 0) return docs;
    let contacts = [];
    for (const doc of docs) {
      let contact = new Contact;
      contact.setData(doc);
      contacts.push(contact);
    }
    this.setData(contacts[0]);
    return contacts;
  }

}

exports.Associate = class Associate extends exports.DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.associate;}

  // Associates have no sub-docs - so just return
  async insertSubDocs(docs) {
    if (docs.length === 0) return docs;
    let associates = [];
    for (const doc of docs) {
      let associate = new Associate;
      associate.setData(doc);
      associates.push(associate);
    }
    this.setData(associates[0]);
    return associates;
  }
}

exports.Engine = class Engine extends exports.DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.engine;}

  // Engines have no sub-docs - so just return
  async insertSubDocs(docs) {
    if (docs.length === 0) return docs;
    let engines = [];
    for (const doc of docs) {
      let engine = new Engine;
      engine.setData(doc);
      engines.push(engine);
    }
    this.setData(engines[0]);
    return engines;
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
  async insertSubDocs(docs) {
    if (docs.length === 0) return docs;
    let aircrafts = [];
    for (const doc of docs) {
      let aircraft = new Aircraft;
      Object.assign(doc,{engines: []});
      aircraft.setData(doc);
      await Promise.all([
          (new exports.Engine).find({_aircraft: aircraft._id, type: 'engine'})
            .then((sdocs) => {aircraft.engines = sdocs}),
        ])
        .then(()=>aircrafts.push(aircraft))
        .catch((err) => reject(err));
    }
    this.setData(aircrafts[0]);
    return aircrafts;
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

  // Insert the associate sub-docs
  async insertSubDocs(docs) {
    if (docs.length === 0) return docs;
    let tasks = [];
    for (const doc of docs) {
      let task = new Task;
      Object.assign(doc,{associates: []});
      task.setData(doc);
      await Promise.all([
          (new exports.Associate).find(task._associates)
            .then((sdocs) => {task.associates = sdocs}),
        ])
        .then(()=>tasks.push(task))
        .catch((err) => reject(err));
    }
    this.setData(tasks[0]);
    return tasks;
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

  // Workorder have sub-docs
  async insertSubDocs(docs) {
    if (docs.length === 0) return docs;
    let workorders = [];
    for (const doc of docs) {
      let workorder = new Workorder;
      Object.assign(doc,{company:[], aircrafts:[], tasks: []});
      workorder.setData(doc);
      await Promise.all([
          (new exports.DataRecord).find({_id: workorder._company, type: 'company'})
            .then((sdocs) => {workorder.company = sdocs}),
          (new exports.Aircraft).find({_id: workorder._aircraft, type: 'aircraft'})
            .then((sdocs) => {workorder.aircrafts = sdocs}),
          (new exports.Task).find({_workorder: workorder._id, type: 'task'})
            .then((sdocs) => {workorder.tasks = sdocs}),
        ])
        .then(()=>workorders.push(workorder))
        .catch((err) => reject(err));
    }
    this.setData(workorders[0]);
    return workorders;
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
