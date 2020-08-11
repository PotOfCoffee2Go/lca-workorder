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

exports.list_all_customers = function(req, res) {
  res.json({_id: 'xyz', name: 'kim'});
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

