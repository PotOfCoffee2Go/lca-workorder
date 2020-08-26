"use strict";

exports.schema = {

"company": {
  "_id": "",
  "_timestamp": "",
  "_type": "company",
  "_contact_ids": [],
  "name": "",
  "address": "",
  "city": "",
  "state": "",
  "zip": "",
  "phone": "",
  "email": "",
  "notes": ""
  },

"associate": {
  "_id": "",
  "_timestamp": "",
  "_type": "associate",
  "name": "",
  "address": "",
  "city": "",
  "state": "",
  "zip": "",
  "phone": "",
  "email": "",
  "notes": ""
},

"contact": {
  "_id": "",
  "_timestamp": "",
  "_type": "contact",
  "name": "",
  "address": "",
  "city": "",
  "state": "",
  "zip": "",
  "phone": "",
  "email": "",
  "notes": ""
 },

"engine": {
  "_id": "",
  "_timestamp": "",
  "_type": "engine",
  "_aircraft_id": "",
  "name": "",
  "model": "",
  "make": "",
  "serial_no": "",
  "registration_no": "",
  "time_in_service": "",
  "time_since_overhaul": "",
  "notes": ""
 },

"aircraft": {
  "_id": "",
  "_timestamp": "",
  "_type": "aircraft",
  "_company_id": "",
  "name": "",
  "model": "",
  "make": "",
  "serial_no": "",
  "registration_no": "",
  "time_in_service": "",
  "notes": ""
  },

"task": {
  "_id": "",
  "_timestamp": "",
  "_type": "task",
  "_workorder_id": "",
  "_associate_ids": "",
  "name": "",
  "discrepancy": "",
  "removed_pn": "",
  "removed_sn": "",
  "corrective_action": "",
  "installed_pn": "",
  "installed_sn": "",
  "time": "",
  "corrected_by": "",
  "inspected_by": "",
  "notes": ""
  },
  
"workorder": {
  "_id": "",
  "_timestamp": "",
  "_type": "workorder",
  "_company_id": "",
  "_aircraft_id": "",
  "name": "",
  "workorder_no": "",
  "date": "",
  "preliminary_inspection": "",
  "hidden_damage_inspection": "",
  "in_progress_inspection": "",
  "start_date": "",
  "completed_date": "",
  "signed_date": "",
  "notes": ""
  }
}
