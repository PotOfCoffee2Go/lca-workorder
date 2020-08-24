# LCA Work Order System

::comment:: Page  options and Editor theme list selector
::id-editorOpts::<div>
<script type="text/doc-canvas-rendered">
  return (new Database).codemirror.buildCssSelect('cmCssSelector');
</script>
<input type="checkbox" id="chk-admin" name="chk-admin"><label for="chk-admin">Admin Buttons</label>
::tx-.7::<input id="show-records" type="button" value="Show DB Records"/>

</div>

----
## Company
::box id-msg-company-top::<div>Information about current company/aircraft/workorder</div>

<div class="form-container">

::box::<div>
  <button id="btn-company-clear"  class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-company-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-company-next" type="button" value="Next">Next</button>
  <button id="btn-company-prev" type="button" value="Prev">Prev</button>
  <button id="btn-company-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="company-form" class="wo-form">
  <label for="company-name">*Name</label><input name="company-name" type="text" value="" /> 
  <label for="company-address">Address</label><input name="company-address" type="text" value="" /> 
  <label for="company-city">City</label><input name="company-city" type="text" value="" /> 
  <label for="company-state">State</label><input name="company-state" type="text" value="" /> 
  <label for="company-zip">Zip</label><input name="company-zip" type="text" value="" /> 
  <label for="company-phone">Phone</label><input name="company-phone" type="text" value="" /> 
  <label for="company-email">Email</label><input name="company-email" type="text" value="" /> 
  <label for="company-notes">Notes</label><input name="company-notes" type="text" value="" /> 
</div>
  <button id="btn-company-add" type="button" value="Add">Add</button>
  <button id="btn-company-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-company-contact" type="button" value="Contacts" class="btn-enabled">Contacts</button>
  <button id="btn-company-aircraft" type="button" value="Aircrafts" class="btn-enabled">Aircrafts</button>
  <button id="btn-company-workorder" type="button" value="Workorders" class="btn-enabled">Workorders</button>
	::cl-admin-btns::<div style="display: none;">
	<hr>
  <button id="btn-company-attach" type="button" value="Attach">Attach</button>
  <button id="btn-company-detach" type="button" value="Detach">Detach</button>
  <button id="btn-company-delete" type="button" value="Delete">Delete</button>
  </div>
</div>

::comment id-msg-company::This area will contain information, confirmations, and error messages about activities done on the form.

::box cl-schema::<pre><code id="schema-company"></code></pre>

::box id-staged-company cl-staged::<div>Company Notes</div>
</div>

::clear box id-msg-company-bottom::<div>&nbsp;</div>

### Contacts
::cl-description::<div>

A contact contains information about any person that Lowcountry Aviation might want to, well... contact. Contacts are usually assigned to a [Company](#company) record.

</div>

::box id-msg-contact-top::<div>Information about current company/aircraft/workorder</div>

<div class="form-container">

::box::<div>
  <button id="btn-contact-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-contact-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-contact-next" type="button" value="Next">Next</button>
  <button id="btn-contact-prev" type="button" value="Prev">Prev</button>
  <button id="btn-contact-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="contact-form" class="wo-form">
  <label for="contact-name">*Name</label><input name="contact-name" type="text" value="" /> 
  <label for="contact-company_id">*Company</label><select name="contact-company_id"></select>
  <label for="contact-address">Address</label><input name="contact-address" type="text" value="" /> 
  <label for="contact-city">City</label><input name="contact-city" type="text" value="" /> 
  <label for="contact-state">State</label><input name="contact-state" type="text" value="" /> 
  <label for="contact-zip">Zip</label><input name="contact-zip" type="text" value="" /> 
  <label for="contact-phone">Phone</label><input name="contact-phone" type="text" value="" /> 
  <label for="contact-email">Email</label><input name="contact-email" type="text" value="" /> 
  <label for="contact-notes">Notes</label><input name="contact-notes" type="text" value="" /> 
</div>
  <button id="btn-contact-add" type="button" value="Add">Add</button>
  <button id="btn-contact-update" type="button" value="Update">Update</button>
	::cl-admin-btns::<div style="display: none;">
  <hr>
  <button id="btn-contact-attach" type="button" value="Attach">Attach</button>
  <button id="btn-contact-detach" type="button" value="Detach">Detach</button>
  <button id="btn-contact-delete" type="button" value="Delete">Delete</button>
	</div>
</div>

::comment id-msg-contact::This area will contain information, confirmations, and error messages about activities done on the form.

::box cl-schema::<pre><code id="schema-contact"></code></pre>

::box id-staged-contact cl-staged::<div>Contact Notes</div>
</div>

::clear box id-msg-contact-bottom::<div>&nbsp;</div>

### Aircrafts
::box id-msg-aircraft-top::<div>Information about current company/aircraft/workorder</div>

<div class="form-container">

::box::<div>
  <button id="btn-aircraft-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-aircraft-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-aircraft-next" type="button" value="Next">Next</button>
  <button id="btn-aircraft-prev" type="button" value="Prev">Prev</button>
  <button id="btn-aircraft-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="aircraft-form" class="wo-form">
  <label for="aircraft-name">*Name</label><input name="aircraft-name" type="text" value="" /> 
  <label for="aircraft-company_id">*Company</label><select name="aircraft-company_id"></select>
  <label for="aircraft-model">Model</label><input name="aircraft-model" type="text" value="" /> 
  <label for="aircraft-make">Make</label><input name="aircraft-make" type="text" value="" /> 
  <label for="aircraft-serial_no">Serial No</label><input name="aircraft-serial_no" type="text" value="" /> 
  <label for="aircraft-registration_no">Registration No</label><input name="aircraft-registration_no" type="text" value="" /> 
  <label for="aircraft-time_in_service">Time in service</label><input name="aircraft-time_in_service" type="text" value="" /> 
  <label for="aircraft-notes">Notes</label><input name="aircraft-notes" type="text" value="" /> 
</div>
  <button id="btn-aircraft-add" type="button" value="Add">Add</button>
  <button id="btn-aircraft-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-aircraft-engine" type="button" value="Engines" class="btn-enabled">Engines</button>
	::cl-admin-btns::<div style="display: none;">
  <hr>
  <button id="btn-aircraft-attach" type="button" value="Attach">Attach</button>
  <button id="btn-aircraft-detach" type="button" value="Detach">Detach</button>
  <button id="btn-aircraft-delete" type="button" value="Delete">Delete</button>
	</div>
</div>

::comment id-msg-aircraft::This area will contain information, confirmations, and error messages about activities done on the form.

::box cl-schema::<pre><code id="schema-aircraft"></code></pre>

::box id-staged-aircraft cl-staged::<div>Aircraft Notes</div>
</div>

::clear box id-msg-aircraft-bottom::<div>&nbsp;</div>

#### Engines
::box id-msg-engine-top::<div>Information about current company/aircraft/workorder</div>

<div class="form-container">

::box::<div>
  <button id="btn-engine-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-engine-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-engine-next" type="button" value="Next">Next</button>
  <button id="btn-engine-prev" type="button" value="Prev">Prev</button>
  <button id="btn-engine-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="engine-form" class="wo-form">
  <label for="engine-name">*Name</label><input name="engine-name" type="text" value="" /> 
  <label for="engine-aircraft_id">*Aircraft</label><select name="engine-aircraft_id"></select>
  <label for="engine-model">Model</label><input name="engine-model" type="text" value="" /> 
  <label for="engine-make">Make</label><input name="engine-make" type="text" value="" /> 
  <label for="engine-serial_no">Serial No</label><input name="engine-serial_no" type="text" value="" /> 
  <label for="engine-registration_no">Registration No</label><input name="engine-registration_no" type="text" value="" /> 
  <label for="engine-time_in_service">Time in service</label><input name="engine-time_in_service" type="text" value="" /> 
  <label for="engine-time_since_overhaul">Time since overhaul</label><input name="engine-time_since_overhaul" type="text" value="" /> 
  <label for="engine-notes">Notes</label><input name="engine-notes" type="text" value="" /> 
</div>
  <button id="btn-engine-add" type="button" value="Add">Add</button>
  <button id="btn-engine-update" type="button" value="Update">Update</button>
	::cl-admin-btns::<div style="display: none;">
  <hr>
  <button id="btn-engine-attach" type="button" value="Attach">Attach</button>
  <button id="btn-engine-detach" type="button" value="Detach">Detach</button>
  <button id="btn-engine-delete" type="button" value="Delete">Delete</button>
	</div>
</div>

::comment id-msg-engine::This area will contain information, confirmations, and error messages about activities done on the form.

::box cl-schema::<pre><code id="schema-engine"></code></pre>

::box id-staged-engine cl-staged::<div>Engine Notes</div>
</div>

::clear box id-msg-engine-bottom::<div>&nbsp;</div>

----
----
### Workorders
::box id-msg-workorder-top::<div>Information about current company/aircraft/workorder</div>

<div class="form-container">

::box::<div>
  <button id="btn-workorder-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-workorder-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-workorder-next" type="button" value="Next">Next</button>
  <button id="btn-workorder-prev" type="button" value="Prev">Prev</button>
  <button id="btn-workorder-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="workorder-form" class="wo-form">
  <label for="workorder-name">*Name</label><input name="workorder-name" type="text" value="" /> 
  <label for="workorder-workorder_no">*Workorder No</label><input name="workorder-workorder_no" type="text" value="" /> 
  <label for="workorder-company_id">*Company</label><select name="workorder-company_id"></select>
  <label for="workorder-aircraft_id">*Aircraft</label><select name="workorder-aircraft_id"></select>
  <label for="workorder-date">Date</label><input name="workorder-date" type="text" value="" /> 
  <label for="workorder-preliminary_inspection">Preliminary Inspection</label><input name="workorder-preliminary_inspection" type="text" value="" />
  <label for="workorder-hidden_damage_inspection">Hidden Damage Inspection</label><input name="workorder-hidden_damage_inspection" type="text" value="" /> 
  <label for="workorder-in_progress_inspection">In Progress Inspection</label><input name="workorder-in_progress_inspection" type="text" value="" /> 
  <label for="workorder-start_date">Start Date</label><input name="workorder-start_date" type="text" value="" /> 
  <label for="workorder-completed_date">Completed Date</label><input name="workorder-completed_date" type="text" value="" /> 
  <label for="workorder-signed_date">Signed Date</label><input name="workorder-signed_date" type="text" value="" /> 
  <label for="workorder-notes">Notes</label><input name="workorder-notes" type="text" value="" /> 
</div>
  <button id="btn-workorder-add" type="button" value="Add">Add</button>
  <button id="btn-workorder-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-workorder-company" type="button" value="Company" class="btn-enabled">Company</button>
  <button id="btn-workorder-aircraft" type="button" value="Aircraft" class="btn-enabled">Aircraft</button>
  <button id="btn-workorder-task" type="button" value="Tasks" class="btn-enabled">Tasks</button>
	::cl-admin-btns::<div style="display: none;">
	<hr>
  <button id="btn-workorder-attach" type="button" value="Attach">Attach</button>
  <button id="btn-workorder-detach" type="button" value="Detach">Detach</button>
  <button id="btn-workorder-delete" type="button" value="Delete">Delete</button>
	</div>
</div>

::comment id-msg-workorder::This area will contain information, confirmations, and error messages about activities done on the form.

::box cl-schema::<pre><code id="schema-workorder"></code></pre>

::box id-staged-workorder cl-staged::<div>Workorder Notes</div>
</div>

::clear box id-msg-workorder-bottom::<div>&nbsp;</div>

#### Tasks
::box id-msg-task-top::<div>Information about current company/aircraft/workorder</div>

<div class="form-container">

::box::<div>
  <button id="btn-task-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-task-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-task-next" type="button" value="Next">Next</button>
  <button id="btn-task-prev" type="button" value="Prev">Prev</button>
  <button id="btn-task-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="task-form" class="wo-form">
  <label for="task-name">*Name</label><input name="task-name" type="text" value="" /> 
  <label for="task-workorder_id">*Workorder</label><select name="task-workorder_id"></select>
  <label for="task-discrepancy">*Discrepancy</label><input name="task-discrepancy" type="text" value="" /> 
  <label for="task-removed_pn">Removed PN</label><input name="task-removed_pn" type="text" value="" /> 
  <label for="task-removed_sn">Removed SN</label><input name="task-removed_sn" type="text" value="" /> 
  <label for="task-corrective_action">Corrective Action</label><input name="task-corrective_action" type="text" value="" /> 
  <label for="task-installed_pn">Installed PN</label><input name="task-installed_pn" type="text" value="" /> 
  <label for="task-installed_sn">Installed SN</label><input name="task-installed_sn" type="text" value="" /> 
  <label for="task-time">Time</label><input name="task-time" type="text" value="" /> 
  <label for="task-corrected_by">Corrected by</label><input name="task-corrected_by" type="text" value="" /> 
  <label for="task-inspected_by">Inspected by</label><input name="task-inspected_by" type="text" value="" /> 
  <label for="task-notes">Notes</label><input name="task-notes" type="text" value="" /> 
</div>
  <button id="btn-task-add" type="button" value="Add">Add</button>
  <button id="btn-task-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-task-associate" type="button" value="Associates" class="btn-enabled">Associates</button>
	::cl-admin-btns::<div style="display: none;">
  <hr>
  <button id="btn-task-attach" type="button" value="Attach">Attach</button>
  <button id="btn-task-detach" type="button" value="Detach">Detach</button>
  <button id="btn-task-delete" type="button" value="Delete">Delete</button>
	</div>
</div>

::comment id-msg-task::This area will contain information, confirmations, and error messages about activities done on the form.

::box cl-schema::<pre><code id="schema-task"></code></pre>

::box id-staged-task cl-staged::<div>Tasks Notes</div>
</div>

::clear box id-msg-task-bottom::<div>&nbsp;</div>

##### Associates
::cl-description::<div>

An associate is someone who is responsible for performing tasks that have been assigned to a workorder. The task can have multiple associates assigned to the task, such as a mechanic doing work, an inspector, a person that signs off work as completed. See [Task](#task) below.

Normally an associate is an employee, or a company contracted for labor, an inspector,
or a government regulator.

</div>

::box id-msg-associate-top::<div>Information about current company/aircraft/workorder</div>

<div class="form-container">

::box::<div>
  <button id="btn-associate-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-associate-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-associate-next" type="button" value="Next">Next</button>
  <button id="btn-associate-prev" type="button" value="Prev">Prev</button>
  <button id="btn-associate-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="associate-form" class="wo-form">
  <label for="associate-name">*Name</label><input name="associate-name" type="text" value="" /> 
  <label for="associate-task_ids">Tasks</label><select name="associate-task_ids"></select>
  <label for="associate-address">Address</label><input name="associate-address" type="text" value="" /> 
  <label for="associate-city">City</label><input name="associate-city" type="text" value="" /> 
  <label for="associate-state">State</label><input name="associate-state" type="text" value="" /> 
  <label for="associate-zip">Zip</label><input name="associate-zip" type="text" value="" /> 
  <label for="associate-phone">Phone</label><input name="associate-phone" type="text" value="" /> 
  <label for="associate-email">Email</label><input name="associate-email" type="text" value="" /> 
  <label for="asssociate-notes">Notes</label><input name="associate-notes" type="text" value="" /> 
</div>
  <button id="btn-associate-add" type="button" value="Add">Add</button>
  <button id="btn-associate-update" type="button" value="Update">Update</button>
	::cl-admin-btns::<div style="display: none;">
  <hr>
  <button id="btn-associate-attach" type="button" value="Attach">Attach</button>
  <button id="btn-associate-detach" type="button" value="Detach">Detach</button>
  <button id="btn-associate-delete" type="button" value="Delete">Delete</button>
	</div>
</div>

::comment id-msg-associate::This area will contain information, confirmations, and error messages about activities done on the form.

::box cl-schema::<pre><code id="schema-associate"></code></pre>

::box id-staged-associate cl-staged::<div>Associate Notes</div>
</div>

::clear box id-msg-associate-bottom::<div>&nbsp;</div>

<style>
.form-container {
    display: grid;
    grid-template-columns: max-content 500px;
    grid-gap: 10px;
}

div.wo-form {
  display:grid;
  grid-template-columns: max-content max-content;
  grid-gap:5px;
  margin-bottom: 1em;  
}
div.wo-form label       { text-align:right; }
div.woform label:after { content: ":"; }

button.btn-enabled { opacity: 1; }

.staged { display: none; }
.schema { display: none; }
.description { display: none; }

.CodeMirror {
  font-family: monospace;
  font-size: .8em;
  line-height: 24px;
  white-space: pre-wrap;
 /* resize: vertical;
  overflow: auto !important; */
}

</style>

::insert-pages/proposal/database.js::

::script-from/github/gibbok/animatelo.min.js::


::comment:: Styles and scripts for codemirror editor
::insert-from/codemirror/editor.md::

Author: PotOfCoffee2Go
Created: Aug. 9, 2020
Updated: Aug. 17, 2020
Copyright: (c) 2020 Lowcountry Aviation - All Rights reserved.
::comment:: License:
