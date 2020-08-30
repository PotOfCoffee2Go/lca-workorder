const Nedb = require('nedb');
var db = new Nedb({ filename: './databases/test.db', autoload: true, timestampData: true }); // localStoreage
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
    engine: {
      type: 'engine',
      name: '', model: '', make: '',
      serial_no: '', registration_no: '',
      time_in_service: '', time_since_overhaul: '',
      _aircraft: '',
      notes: ''
    },
    aircraft: {
      type: 'aircraft',
      name: '',
      model: '',
      make: '',
      serial_no: '',
      registration_no: '',
      time_in_service: '',
      _company: '',
      notes: ''
      },
    task: {
      type: 'task',
      name: '',
      discrepancy: '',
      removed_pn: '',
      removed_sn: '',
      corrective_action: '',
      installed_pn: '',
      installed_sn: '',
      time: '',
      corrected_by: '',
      inspected_by: '',
      _workorder: '',
      _associates: '',
      notes: ''
      },
    workorder: {
      type: 'workorder',
      name: '',
      workorder_no: '',
      date: '',
      preliminary_inspection: '',
      hidden_damage_inspection: '',
      in_progress_inspection: '',
      start_date: '',
      completed_date: '',
      signed_date: '',
      _company: '',
      _aircraft: '',
      notes: ''
      }
  
  })}
}

const schema = new Schema;

class DataRecord {
  constructor() {}

  // Called by derived class to start over fresh
  reset() { Object.assign(this, this.getSchema()) }

  setData(doc) { Object.assign(this, doc); }

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
  find(id) {
    return new Promise((resolve, reject) => {
      let qry = {};
      if (typeof id === 'string') id = [id];
      if (Array.isArray(id)) qry = {_id: {$in: id }}; else qry = id;
      db.find(qry, (err, docs) => {
        if (err) {reject(err); return;}
        this.insertSubDocs(docs)
          .then((dbRecs)=>resolve(dbRecs));
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
          .then((dbRec) => resolve(dbRec));
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
          .then((dbRec) => resolve(dbRec));
      })
    }) // Promise
  }
  
  change(ob) {
    return new Promise((resolve, reject) => {
      Object.assign(this, ob);
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

  init() { super.reset(); }

  getSchema() {return schema.company;}

  // Insert the contact sub-docs
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      let companies = [];
      docs.forEach((doc, idx) => {
        let company = new Company;
        company.setData(doc);
        companies.push(company);
        let contact = new Contact, workorder = new Workorder, aircraft = new Aircraft;
        Promise.all([
          contact.find(company._contacts)
            .then((contactdocs) => {company.contacts = contactdocs}),
          workorder.find({ _company: company._id, type: 'workorder' })
            .then((workorderdocs) => {company.workorders = workorderdocs}),
          aircraft.find({ _company: company._id, type: 'aircraft' })
            .then((aircraftdocs) => {company.aircrafts = aircraftdocs}),
          ])
          .then(()=>this.setData(companies[0]))
          .then(()=>{if (idx+1 === docs.length) resolve(companies)})
          .catch((err) => reject(err));
      })
    })
  }

  // Remove the contact sub-docs
  removeSubDocs() {
      delete this.contacts;
      delete this.aircrafts;
      delete this.workorders;
return;
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

  attachContact(dbrec) {
    return new Promise((resolve, reject) => {
      this._contacts.push(dbrec._id);
      this._contacts = this._contacts.filter(this.unique);
      this.update()
        .then((dbRecs)=>resolve(dbRecs));
    })
  }

  detach(dbrec) {
    return new Promise((resolve, reject) => {
      let idx = this._contacts.indexOf(dbrec._id);
      if (idx > -1) this._contacts.splice(idx,1);
      this.find(this._id)
        .then((dbRecs)=>resolve(dbRecs));
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
      this.setData(contacts[0]);
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
      this.setData(associates[0]);
      resolve(associates);
    })
  }

  // Associates has no sub-docs to remove
  removeSubDocs() {}

}
class Engine extends DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.engine;}

  // Engines have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
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

  // Engines has no sub-docs to remove
  removeSubDocs() {}

  assignAircraft(dbrec) {
    return new Promise((resolve, reject) => {
      if (dbrec.type !== 'aircraft') {
        return reject(this.isInvalidType(dbrec._id, dbrec.type, 'aircraft'));
      }
      this._aircraft = dbrec._id;
      this.update()
        .then(() => resolve(this));
    })
  }
}

class Aircraft extends DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.aircraft;}

  // Aircraft have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      let aircrafts = [];
      docs.forEach((doc) => {
        let aircraft = new Aircraft;
        aircrafts.push(aircraft);
        aircraft.setData(doc);
      })
      this.setData(aircrafts[0]);
      resolve(aircrafts);
    })
  }

  // Aircraft has no sub-docs to remove
  removeSubDocs() {
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

class Task extends DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.task;}

  // Task have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      let tasks = [];
      docs.forEach((doc) => {
        let task = new Task;
        tasks.push(task);
        task.setData(doc);
      })
      this.setData(tasks[0]);
      resolve(tasks);
    })
  }

  // Insert the contact sub-docs
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      let tasks = [];
      docs.forEach((doc, idx) => {
        let task = new Task;
        task.setData(doc);
        tasks.push(task);
        let associate = new Associate;
        Promise.all([
          associate.find(task._associates)
            .then((associatedocs) => {task.associates = associatedocs}),
          ])
          .then(()=>this.setData(tasks[0]))
          .then(()=>{if (idx+1 === docs.length) resolve(tasks)})
          .catch((err) => reject(err));
      })
    })
  }
  // Task has no sub-docs to remove
  removeSubDocs() {
    delete this.associates;
  }

  assignWorkorder(dbrec) {
    return new Promise((resolve, reject) => {
      if (dbrec.type !== 'workorder') {
        return reject(this.isInvalidType(dbrec._id, dbrec.type, 'workorder'));
      }
      this._workorder = dbrec._id;
      this.update()
        .then(() => resolve(this));
    })
  }

  attachAssociate(dbrec) {
    return new Promise((resolve, reject) => {
      this._associates.push(dbrec._id);
      this._associates  = this._contacts.filter(this.unique);
      this.update()
        .then((dbRecs)=>resolve(dbRecs));
    })
  }


}

class Workorder extends DataRecord {
  constructor(){super(); this.init()}
  
  init() {super.reset();}

  getSchema() {return schema.workorder;}

  // Workorder have no sub-docs - so just return
  insertSubDocs(docs) {
    return new Promise((resolve, reject) => {
      let workorders = [];
      docs.forEach((doc) => {
        let workorder = new Workorder;
        workorders.push(workorder);
        workorder.setData(doc);
      })
      this.setData(workorders[0]);
      resolve(workorders);
    })
  }

  // Workorder has no sub-docs to remove
  removeSubDocs() {}

  assignCompany(dbrec) {
    return new Promise((resolve, reject) => {
      if (dbrec.type !== 'company') {
        return reject(this.isInvalidType(dbrec._id, dbrec.type, 'company'));
      }
      this._company = dbrec._id;
      this.update()
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
        .then(() => resolve(this));
    })
  }

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
let rcon = new Company;
let econ = new Engine;
let acon = new Aircraft;

tcon.change({name:'kim'})
.then(() => tcon.insert())

.then(()=>ccon.change({notes: 'new contact'}))
.then(() => ccon.insert())

.then (() => tcon.attachContact(ccon))

.then (() => rcon.find(tcon._id))
.then(()=>console.log('rcon',rcon))


.then(()=>econ.change({notes: 'new engine'}))
.then (() => econ.insert())
//.then (() => econ.assignAircraft(tcon))
.then(()=>console.log('econ',econ))

.then(()=>acon.change({notes: 'new aircraft'}))
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
