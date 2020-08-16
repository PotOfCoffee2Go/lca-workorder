'use strict';

//var mongoose = require('mongoose'),
//  Task = mongoose.model('Tasks');

// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb'),
  db = new Datastore({ filename: `./databases/workorders.db`, autoload: true }),
  dbs = require('../models/workorderModel');

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
    res.json(fndDocs);
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

