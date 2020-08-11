'use strict';

exports.schema = {

associate: {
  '_id': '',
  '_type': 'associate',
  'name': '',
  'address': '',
  'city': '',
  'state': '',
  'zip': '',
  'phone': '',
  'email': '',
},

contact: {
  '_id': '',
  '_type': 'contact',
  'name': '',
  'address': '',
  'city': '',
  'state': '',
  'zip': '',
  'phone': '',
  'email': '',
  },

company: {
  '_id': '',
  '_type': 'company',
  '_customer_ids': [],
  'name': '',
  'address': '',
  'city': '',
  'state': '',
  'zip': '',
  'phone': '',
  'email': '',
  },

engine: {
  '_id': '',
  '_type': 'engine',
  'model': '',
  'make': '',
  'serial no': '',
  'registration no': '',
  'time in service': '',
  'time since overhaul': '',
  },

craft: {
  '_id': '',
  '_type': 'craft',
  '_engine_id': '',
  'model': '',
  'make': '',
  'serial no': '',
  'registration no': '',
  'time in service': '',
  },

task: {
  '_id': '',
  '_type': 'task',
  '_associate_id': '',
  'discrepancy': '',
  'removed_pn': '',
  'removed_sn': '',
  'corrrective_action': '',
  'installed_pn': '',
  'installed_sn': '',
  'time': '',
  'corrected_by': '',
  'inspected_by': '',
  },
  
workorder: {
  '_id': '',
  '_type': 'workorder',
  '_company_id': '',
  '_task_ids': [],
  'date': '',
  'preliminary_inspection': '',
  'hidden_damage_inspection': '',
  'in_progress_inspection': '',
  'start_date': '',
  'completed_date': '',
  },

}


/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: {
    type: String,
    Required: 'Kindly enter the name of the task'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});


module.exports = mongoose.model('Tasks', TaskSchema);
*/
