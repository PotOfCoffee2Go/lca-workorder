// Order on worksheets
exports._subdocs = ['contacts', 'aircrafts', 'engines',
      'workorders', 'tasks', 'associates', 'company']      

exports._required = { company: [], contact: [], associate: [],
  aircraft: ['_company'], engine: ['_aircraft'], 
  workorder:['_company', '_aircraft'], task: ['_workorder']
}

exports.Orderform = class Orderform {
  constructor() {this.init();}

  init() { Object.assign(this, {
    type: 'orderform',
    companyname: '', address: '', city: '', state: '', zip: '',
    phone: '', email: '',
    aircraft_name: '', make: '', model: '', series: '', serial_no: '',
    registration_no: '', time_in_service: '',
    workorder_name: '', workorder_no: '', date: '', preliminary_inspection: '',
    hidden_damage_inspection: '', in_progress_inspection: '',
    start_date: '',completed_date: '', signed_date: '',
    work_requested: '', inspection_discrepancies: ''
  })}
};


exports.Schema = class Schema {
  constructor() {this.init();}

  init() { Object.assign(this, {
    company: { 
      type: 'company',
      name: '', address: '', city: '', state: '', zip: '',
      phone: '', email: '',
      notes: '',
      _contacts: [],
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
      notes: '',
      _aircraft: '',
    },
    aircraft: {
      type: 'aircraft',
      name: '', make: '', model: '', series: '', serial_no: '',
      registration_no: '', time_in_service: '',
      notes: '',
      _company: '',
      },
    task: {
      type: 'task',
      name: '', unscheduled: "", discrepancy: '', removed_pn: '', removed_sn: '',
      corrective_action: '', installed_pn: '', installed_sn: '',
      time: '', corrected_by: '', inspected_by: '',
      notes: '',
      _workorder: '',  _engine: '', _associates: [],
      },
    workorder: {
      type: 'workorder',
      name: '', workorder_no: '', date: '', preliminary_inspection: '',
      hidden_damage_inspection: '', in_progress_inspection: '',
      start_date: '',completed_date: '', signed_date: '',
      work_requested: '', inspection_discrepancies: '',
      notes: '',
      _company: '', _aircraft: '',
      }
  })}
}

exports.Formats = class Formats {
  constructor() {this.init();}
  
  init() {
    this.list = ['sheet','table', 'csv', 'json'];
  }
}
