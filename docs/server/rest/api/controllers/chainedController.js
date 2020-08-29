'use strict';

//var mongoose = require('mongoose'),
//  Task = mongoose.model('Tasks');

// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb'),
  db = new Datastore({ filename: `./databases/workorders.db`, autoload: true }),
  dbs = require('../models/workorderModel');

class Company {
  constructor () { this.init() }
  init() {
    Object.assign(this, {
      _id: '',
      _timestamp: '',
      _type: 'company',
      _contact_ids: [],
      name': '',
      address': '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email': '',
      notes': ''
    })
  }  
  // Check fetch() http status
  //  when valid return response text
  textResponse(res) {
    return res.ok
    ? Promise.resolve(res.text())
    : Promise.reject(`HTTP error: (${res.status}) - ${res.statusText}\n${res.url}`);
  }

}


const Chaintastic = require('chaintastic');

exports.read_schema = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({schema: dbs.schema}, null, 2));

  //res.json({schema: dbs.schema});
}

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


const woRec = Chaintastic({
  s
  
  link(parent, child, cb) {},
  
  empty(cb) {
    cb({
      company: "",
      contact: [],
      aircraft: [],
      engine:[],
      workorder: [],
      task: []
      associate: []  
      }
    })
  }


}

const chain = Chaintastic({
  getrecord(id, type, cb) {
    db.find({_id: id, _type: type ? type : /.*/}, (err,fndDocs) => {
      if (err) cb([]);
      else cb(fndDocs);
    })
  },
  
  getWorkorderCompanyId(workorderId, cb) {
    db.find({_id: workorderId, _type: 'workorder'}, (err,fndDocs) => {
      if (err || !fndDocs.length) cb('');
      else cb(fndDocs[0]._company_id);
    })
  },

  findCompany(id, cb) {
    db.findOne({_id: id, _type: 'company'}, (err, fndDoc) => {
      if (err || !fndDoc) cb([]);
      cb(fndDoc);
    })
  },

  findContacts(dbrec, cb) {
    let waitForAll = dbrec._contact_ids.length;
    dbrec.contacts = [];
    if (waitForAll === 0) {cb(dbrec);return;}
    dbrec._contact_ids.forEach(id => {
      db.findOne({_id: id, _type: 'contact'}, (err, fndDoc) => {
        dbrec.contacts.push(fndDoc);
        if ((--waitForAll) <= 0) cb(dbrec);
      })
    })
  },


  findAircrafts(dbrec, cb) {
      console.log('err', dbrec._id);
    db.find({_company_id: dbrec._id, _type: 'aircraft'}, (err, fndDocs) => {
      if (err) cb([]);
      dbrec.aircrafts = fndDocs;
      cb(dbrec);
    })
  },

  findEngines(dbrec, cb) {
    let waitForAll = dbrec.aircrafts.length;
      console.log('err', waitForAll);

    if (waitForAll === 0) cb(dbrec);
    dbrec.aircrafts.forEach((aircraft, idx) => {
      db.find({_aircraft_id: aircraft._id, _type: 'engine'}, (err, fndDocs) => {
        dbrec.aircrafts[idx].engines = fndDocs;
        if ((--waitForAll) <= 0) cb(dbrec);
      })
    })
  },

  findWorkorders(dbrec, cb) {
    db.find({_company_id: dbrec._id, _type: 'workorder'}, (err, fndDocs) => {
      if (err) cb([]);
      dbrec.workorders = fndDocs;
      cb(dbrec);
    })
  },

  findTasks(dbrec, cb) {
    let waitForAll = dbrec.workorders.length;
    if (waitForAll === 0) cb(dbrec);
    dbrec.workorders.forEach((workorder, idx) => {
      db.find({_workorder_id: workorder._id, _type: 'task'}, (err, fndDocs) => {
        dbrec.workorders[idx].tasks = fndDocs;
        if ((--waitForAll) <= 0) cb(dbrec);
      })
    })
  },

  findAssociates(dbrec, cb) {
    let gotAssociate = false;
    let waitForAllWorkorders = dbrec.workorders.length;
    dbrec.workorders.forEach((workorder, widx) => {
      let waitForAllTasks = workorder.tasks.length;
      if (waitForAllTasks === 0) waitForAllWorkorders--;
      workorder.tasks.forEach((task, tidx) => {
        let waitForAll = task._associate_ids.length;
        task.associates = [];
        if (waitForAll === 0 ) waitForAllTasks--;
        task._associate_ids.forEach(id => {
          gotAssociate = true;
          db.findOne({_id: id, _type: 'associate'}, (err, fndDoc) => {
            task.associates.push(fndDoc);
            if ((--waitForAll) <= 0) waitForAllTasks--;
            if ((waitForAllTasks) <= 0) waitForAllWorkorders--;
            if ((waitForAllWorkorders) <= 0) cb(dbrec);
          })
        })
      })
    })
    if (!gotAssociate) cb(dbrec);
  },

});

function getCompanyRecords(cid, cb) {
//  let prj = { _id:1, _type:1, name:1, _company_id:1, _aircraft_id: 1, _workorder_id: 1, _contact_ids:1, _associate_ids: 1 };
  let order = [];

  let prj = {_timestamp: 0};
  let qry = { $or: [{ _id: cid }, { _company_id: cid }, { _contact_ids: cid }] }
  db.find(qry ,prj, (err, lvl1Docs) => {
     if  (err) console.log('errddddddrrrr', err);
     let qry2 = [];
    lvl1Docs.forEach(rec => {
      if (rec._type === 'workorder') qry2.push({_workorder_id: rec._id});
      if (rec._type === 'aircraft') qry2.push({_aircraft_id: rec._id});
      if (rec._type === 'company') qry2.push({_id: {$in: rec._contact_ids}});
    })
    db.find({ $or: qry2 }, prj, (err, lvl2Docs) => {
      if  (err) console.log('errrrrr', err);
      let qry3 = [];
      lvl1Docs.concat(lvl2Docs).forEach(rec => {
        if (rec._type === 'task') qry3 = qry3.concat(rec._associate_ids);
      })
      db.find({ _id: {$in: qry3}}, prj, (err, lvl3Docs) => {
      if  (err) console.log('errrreeeerr', err);
      else {
        lvl1Docs.concat(lvl2Docs, lvl3Docs).forEach(doc => {
          order.push(doc);
        });
        cb(order);
      }  
      })
    })
  })
}

function fieldsSheet(type) {
  const sch = require('../models/worksheetModel');
  let fields = [];
  Object.keys(sch.schema[type]).forEach( scheme => {
      fields.push(scheme);
  })
  return { fields }
}

function companySheet(order) {
  const wrksht = require('../models/worksheetModel').fields;
  const { Parser } = require('json2csv');
  var opts = { wrksht };
  const parser = new Parser(opts);
  console.log(JSON.stringify(order,null,2));
  let sheet = "";
  order.forEach(rec => {
    delete rec._workorder_id;
    delete rec._aircraft_id;
    delete rec._company_id;
  });
    try {
      const csv = parser.parse(order);
      sheet = sheet + csv + '\r\n\r\n';
    } catch (err) {
      console.error(err);
    }
  return sheet;
}

exports.test = function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Test not implemented');
}

exports.csv_company = function(req, res) {
  getCompanyRecords(req.params.id, (order) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end(companySheet(order));
  })
}

//chain.init(10).sum(5).display().then(console.log); // 'Your number is 15'
exports.csv_records = function(req, res) {
  let id = req.params.id === '*' ? /.*/ : req.params.id;
  let type = req.params.type ? req.params.type : '';
  type = type === '*' ? /.*/ : type;
  
  const { Parser } = require('json2csv');

  chain.init(id).getrecord(type).then(recs => {
    recs.forEach(rec => delete rec._timestamp)
    try {
      const parser = new Parser();
      const csv = parser.parse(recs);
      res.setHeader('Content-Type', 'text/plain');
      res.end(csv);
      
    } catch (err) {
      console.error(err);
    }
  })

}



exports.read_a_company = function(req, res) {
  chain.init(req.params.id)
    .findCompany()
    .findAircrafts().findEngines()
    .findWorkorders().findTasks().findAssociates()
    .findContacts()
  .then(company => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([company], null, 2));
  });
}    

exports.get_a_record = function(req, res) {
  chain.init(req.params.id).getrecord('') // Just use id - no type
  .then(record => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(record, null, 2));
  });
}    

exports.list_query = function(req, res) {
  let apireq = req.body;
  let query = {};
  Object.assign(query, apireq);
  db.find(query.find, query.projection, (err, fndDocs) => {
    if (err) { res.send(err); }
    res.json(fndDocs);
  });
}

exports.find_query = function(req, res) {
  let apireq = req.body;
  let query = {};
  Object.assign(query, apireq);
  db.find(query.find, (err, fndDocs) => {
    if (err) { res.send(err); }
    res.json(fndDocs);
  });
}

exports.add_query = function(req, res) {
  let apireq = req.body;
  let query = {};
  Object.assign(query, apireq);

  db.insert(query.add, (err, newDoc) => {
    if (err) { res.send(err); }
    db.find({_id: newDoc._id}, (err, fndDocs) => {
      if (err) { res.send(err); }
      res.json(fndDocs);
    });
  });
}

exports.update_query = function(req, res) {
  let apireq = req.body;
  let query = {};
  Object.assign(query, apireq);

  db.update(query.find, {$set: query.update}, {}, (err, numReplaced) => {
    if (err) { res.send(err); }
    db.find(query.find, (err, fndDocs) => {
      if (err) { res.send(err); }
      res.json(fndDocs);
    });
  });
}


exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id:req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
// Task.remove({}).exec(function(){});
exports.delete_a_task = function(req, res) {

  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

