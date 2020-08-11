"use strict";

exports.schema = {

associate: {
  "_id": "",
  "_timestamp": "",
  "_type": "associate",
  "name": "",
  "address": "",
  "city": "",
  "state": "",
  "zip": "",
  "phone": "",
  "email": ""
},

contact: {
  "_id": "",
  "_timestamp": "",
  "_type": "contact",
  "name": "",
  "address": "",
  "city": "",
  "state": "",
  "zip": "",
  "phone": "",
  "email": ""
  },

company: {
  "_id": "",
  "_timestamp": "",
  "_type": "company",
  "_contact_ids": [],
  "_aircraft_ids": [],
  "name": "",
  "address": "",
  "city": "",
  "state": "",
  "zip": "",
  "phone": "",
  "email": ""
  },

engine: {
  "_id": "",
  "_timestamp": "",
  "_type": "engine",
  "model": "",
  "make": "",
  "serial_no": "",
  "registration_no": "",
  "time_in_service": "",
  "time_since_overhaul": ""
  },

aircraft: {
  "_id": "",
  "_timestamp": "",
  "_type": "aircraft",
  "_engine_id": "",
  "model": "",
  "make": "",
  "serial_no": "",
  "registration_no": "",
  "time_in_service": ""
  },

task: {
  "_id": "",
  "_timestamp": "",
  "_type": "task",
  "_associate_ids": [],
  "discrepancy": "",
  "removed_pn": "",
  "removed_sn": "",
  "corrective_action": "",
  "installed_pn": "",
  "installed_sn": "",
  "time": "",
  "corrected_by": "",
  "inspected_by": ""
  },
  
workorder: {
  "_id": "",
  "_timestamp": "",
  "_type": "workorder",
  "_company_id": "",
  "_aircraft_id": "",
  "_task_ids": [],
  "workorder_no": "",
  "date": "",
  "preliminary_inspection": "",
  "hidden_damage_inspection": "",
  "in_progress_inspection": "",
  "start_date": "",
  "completed_date": "",
  "signed_date": ""
  }
}
