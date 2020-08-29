'use strict';

exports.fields = [
  // company / contact / associate
  '_id', '_type', 'name', 'address', 'city', 'state', 'zip', 'phone', 'email', 'notes',
  // aircraft / engine
  'model', 'make', 'serial_no', 'registration_no', 'time_in_service', 'time_since_overhaul',
  // task
  'discrepancy', 'removed_pn', 'removed_sn', 'corrective_action', 'installed_pn',
  'installed_sn', 'time', 'corrected_by', 'inspected_by',
  // workorder
  'workorder_no', 'date', 'preliminary_inspection', 'hidden_damage_inspection',
  'in_progress_inspection', 'start_date', 'completed_date', 'signed_date',
]
