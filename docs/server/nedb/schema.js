class Schema {
  constructor() {this.init();}

  init() { Object.assign(this, {
    company: { 
      type: 'company',
      name: '', address: '', city: '', state: '', zip: '',
      phone: '', email: '',
      _contacts: [],
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
      name: '', model: '', make: '', serial_no: '',
      registration_no: '', time_in_service: '',
      _company: '',
      notes: ''
      },
    task: {
      type: 'task',
      name: '', discrepancy: '', removed_pn: '', removed_sn: '',
      corrective_action: '', installed_pn: '', installed_sn: '',
      time: '', corrected_by: '', inspected_by: '',
      _workorder: '',  _associates: [],
      notes: ''
      },
    workorder: {
      type: 'workorder',
      name: '', workorder_no: '', date: '', preliminary_inspection: '',
      hidden_damage_inspection: '', in_progress_inspection: '',
      start_date: '',completed_date: '', signed_date: '',
      _company: '', _aircraft: '',
      notes: ''
      }
  })}
}

module.exports.Schema = Schema;
