'use strict';

//var mongoose = require('mongoose'),
//  Task = mongoose.model('Tasks');

// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb'),
  db = new Datastore({ filename: `./databases/workorders.db`, autoload: true }),
  dbs = require('../models/workorderModel');

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

function findDone(err, fndDocs) {
  if (err) return [];
  return fndDocs;
}

const chain = Chaintastic({
  findCompany(companyId, cb) {
    db.find({_id: companyId, _type: 'company'}, (err,fndDocs) => {
      if (err) cb([]);
      cb(fndDocs[0]);
    })
  },
  findAircrafts(dbrec, cb) {
    db.find({_company_id: dbrec._id, _type: 'aircraft'}, (err, fndDocs) => {
      if (err) cb([]);
      dbrec.aircrafts = fndDocs;
      cb(dbrec);
    })
  },
  findEngines(dbrec, cb) {
    let waitForAll = dbrec.aircrafts.length;
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
    dbrec.workorders.forEach((workorder, idx) => {
      db.find({_workorder_id: workorder._id, _type: 'task'}, (err, fndDocs) => {
        dbrec.workorders[idx].tasks = fndDocs;
        if ((--waitForAll) <= 0) cb(dbrec);
      })
    })
  },
  findAssociates(dbrec, cb) {
    let waitForAllWorkorders = dbrec.workorders.length;
    dbrec.workorders.forEach((workorder, widx) => {
      let waitForAllTasks = workorder.tasks.length;
      workorder.tasks.forEach((task, tidx) => {
        db.find({_task_ids: task._id, _type: 'associate'}, (err, fndDocs) => {
          dbrec.workorders[widx].tasks[tidx].associates = fndDocs;
          if ((--waitForAllTasks) <= 0) waitForAllWorkorders--;
          if ((waitForAllWorkorders) <= 0) cb(dbrec);
        })
      })
    })
  },


  sum(a, b) {
    return a + b;
  },
  display(value) {
    return 'Your number is ' + value.aircrafts[0].name;
  }
});

//chain.init(10).sum(5).display().then(console.log); // 'Your number is 15'

exports.read_a_company = function(req, res) {
  chain.init(req.params.companyId)
    .findCompany().findAircrafts().findEngines()
    .findWorkorders().findTasks().findAssociates()
  .then(company => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(company, null, 2));
  });
}    
/*
exports.read_a_company = function(req, res) {
  db.find({_id: req.params.companyId, _type: 'company'}, (err, fndDocs) => {
    if (err) { res.send(err); }
    if (fndDocs.length) {
      let companyId = fndDocs[0]._id;
      db.find({_company_id: companyId, _type: 'aircraft'}, (err, subDocs) => {
        fndDocs[0].aircrafts = subDocs;
      fndDocs[0].aircrafts.forEach(aircraft => {
        db.find({_aircraft_id: aircraft._id, _type: 'engine'}, (err, subDocs) => {
        aircraft.engines = subDocs;
      })})

      db.find({_company_id: companyId, _type: 'workorder'}, (err, subDocs) => {
        fndDocs[0].workorders = subDocs;
      fndDocs[0].workorders.forEach((workorder, idx) => {
        db.find({_workorder_id: workorder._id, _type: 'task'}, (err, subDocs) => {
        fndDocs[0].workorders[idx].tasks = subDocs;
        fndDocs[0].workorders[idx].tasks.forEach((task, tidx) => {
          db.find({_task_ids: task._id, _type: 'associate'}, (err, subDocs) => {
          fndDocs[0].workorders[idx].tasks[tidx].associates = subDocs;
      })})})})

      db.find({_company_ids: companyId, _type: 'contact'}, (err, subDocs) => {
        fndDocs[0].contacts = subDocs;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(fndDocs, null, 2));
      })})})//})});
    }
    else {
      console.log(fndDocs);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(fndDocs, null, 2));
    }
  });
};
*/
function contacts(companyId, cb) {
  console.log(companyId);
  db.find({_company_ids: companyId, _type: 'contact'}, (err, fndDocs) => {
    cb(err, fndDocs);
  });
};

function aircraft(companyId, cb) {
  console.log(companyId);
  db.find({_company_id: companyId, _type: 'aircraft'}, (err, fndDocs) => {
    cb(err, fndDocs);
  });
};

function associates(associateIds) {
  db.find({_id: req.params.companyId, _type: 'associate'}, (err, fndDocs) => {
    if (err) { res.send(err); }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(fndDocs, null, 2));
  });
};

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

