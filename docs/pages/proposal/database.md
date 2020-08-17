# Proposed Database Records

::comment:: Page  options and Editor theme list selector
::id-editorOpts::<div>
<script type="text/doc-canvas-rendered">
  return (new Database).codemirror.buildCssSelect('cmCssSelector');
</script>
::tx-.7::<input id="show-records" type="button" value="Show DB Records"/>
</div>

::bg-blue tx-center box:: Company Records

## Company
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
  <button id="btn-company-clear"  class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-company-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-company-next" type="button" value="Next">Next</button>
  <button id="btn-company-prev" type="button" value="Prev">Prev</button>
  <button id="btn-company-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="company-form" class="settings">
  <label for="company-name">*Name</label><input name="company-name" type="text" value="Fly by Night, LLC" /> 
  <label for="company-address">Address</label><input name="company-address" type="text" value="999 Ut-Oh Way" /> 
  <label for="company-city">City</label><input name="company-city" type="text" value="Cottageville" /> 
  <label for="company-state">State</label><input name="company-state" type="text" value="SC" /> 
  <label for="company-zip">Zip</label><input name="company-zip" type="text" value="29435" /> 
  <label for="company-phone">Phone</label><input name="company-phone" type="text" value="8435551212" /> 
  <label for="company-email">Email</label><input name="company-email" type="text" value="freestick@mailserver.com" /> 
  <label for="company-notes">Notes</label><input name="company-notes" type="text" value="" /> 
</div>
  <button id="btn-company-add" type="button" value="Add">Add</button>
  <button id="btn-company-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-company-contact" type="button" value="Contacts">Contacts</button>
  <button id="btn-company-aircraft" type="button" value="Aircrafts">Aircrafts</button>
	<hr>
  <button id="btn-company-attach" type="button" value="Attach">Attach</button>
  <button id="btn-company-detach" type="button" value="Detach">Detach</button>
  <button id="btn-company-delete" type="button" value="Delete">Delete</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-company"></code></pre>

::left margin-.1 box id-staged-company cl-staged::<div>
Company Notes
</div>

::clear box id-msg-company::This area will contain information, confirmations, and error messages about activities done on the form.

### Contacts
::cl-description::<div>

A contact contains information about any person that Lowcountry Aviation might want to, well... contact. Contacts are usually assigned to a [Company](#company) record.

</div>

::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
  <button id="btn-contact-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-contact-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-contact-next" type="button" value="Next">Next</button>
  <button id="btn-contact-prev" type="button" value="Prev">Prev</button>
  <button id="btn-contact-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="contact-form" class="settings">
  <label for="contact-company_id">*Company</label><select name="contact-company_id">
    <option value="default">default</option>
    <option value="a11y-dark">a11y-dark</option>
    <option value="a11y-light">a11y-light</option>
  </select>
  <label for="contact-name">*Name</label><input name="contact-name" type="text" value="Frank" /> 
  <label for="contact-address">Address</label><input name="contact-address" type="text" value="111 Dead End Ave." /> 
  <label for="contact-city">City</label><input name="contact-city" type="text" value="Cottageville" /> 
  <label for="contact-state">State</label><input name="contact-state" type="text" value="SC" /> 
  <label for="contact-zip">Zip</label><input name="contact-zip" type="text" value="29435" /> 
  <label for="contact-phone">Phone</label><input name="contact-phone" type="text" value="8435551212" /> 
  <label for="contact-email">Email</label><input name="contact-email" type="text" value="silly@mailserver.com" /> 
  <label for="contact-notes">Notes</label><input name="contact-notes" type="text" value="" /> 
</div>
  <button id="btn-contact-add" type="button" value="Add">Add</button>
  <button id="btn-contact-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-contact-attach" type="button" value="Attach">Attach</button>
  <button id="btn-contact-detach" type="button" value="Detach">Detach</button>
  <button id="btn-contact-delete" type="button" value="Delete">Delete</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-contact"></code></pre>

::left margin-.1 box id-staged-contact cl-staged::<div>
Contact Notes
</div>

::clear box id-msg-contact::This area will contain information, confirmations, and error messages about activities done on the form.

### Aircrafts
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
  <button id="btn-aircraft-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-aircraft-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-aircraft-next" type="button" value="Next">Next</button>
  <button id="btn-aircraft-prev" type="button" value="Prev">Prev</button>
  <button id="btn-aircraft-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="aircraft-form" class="settings">
  <label for="aircraft-company_id">*Company</label><select name="aircraft-company_id">
    <option value="default">default</option>
    <option value="a11y-dark">a11y-dark</option>
    <option value="a11y-light">a11y-light</option>
  </select>
  <label for="aircraft-name">*Name</label><input name="aircraft-name" type="text" value="Blue with Yellow nose" /> 
  <label for="aircraft-model">Model</label><input name="aircraft-model" type="text" value="A big boy" /> 
  <label for="aircraft-make">Make</label><input name="aircraft-make" type="text" value="Torked" /> 
  <label for="aircraft-serial_no">Serial No</label><input name="aircraft-serial_no" type="text" value="1234-xyz" /> 
  <label for="aircraft-registration_no">Registration No</label><input name="aircraft-registration_no" type="text" value="abc-123" /> 
  <label for="aircraft-time_in_service">Time in service</label><input name="aircraft-time_in_service" type="text" value="6543.1" /> 
  <label for="aircraft-notes">Notes</label><input name="aircraft-notes" type="text" value="" /> 
</div>
  <button id="btn-aircraft-add" type="button" value="Add">Add</button>
  <button id="btn-aircraft-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-aircraft-engine" type="button" value="Engines">Engines</button>
  <hr>
  <button id="btn-aircraft-attach" type="button" value="Attach">Attach</button>
  <button id="btn-aircraft-detach" type="button" value="Detach">Detach</button>
  <button id="btn-aircraft-delete" type="button" value="Delete">Delete</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-aircraft"></code></pre>

::left margin-.1 box id-staged-aircraft cl-staged::<div>
Aircraft Notes
</div>

::clear box id-msg-aircraft::This area will contain information, confirmations, and error messages about activities done on the form.

#### Engines
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
  <button id="btn-engine-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-engine-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-engine-next" type="button" value="Next">Next</button>
  <button id="btn-engine-prev" type="button" value="Prev">Prev</button>
  <button id="btn-engine-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="engine-form" class="settings">
  <label for="engine-aircraft_id">*Aircraft</label><select name="engine-aircraft_id">
    <option value="default">default</option>
    <option value="a11y-dark">a11y-dark</option>
    <option value="a11y-light">a11y-light</option>
  </select>
  <label for="engine-name">*Name</label><input name="engine-name" type="text" value="Fuel-ish" /> 
  <label for="engine-model">Model</label><input name="engine-model" type="text" value="A big boy" /> 
  <label for="engine-make">Make</label><input name="engine-make" type="text" value="Torked" /> 
  <label for="engine-serial_no">Serial No</label><input name="engine-serial_no" type="text" value="1234-xyz" /> 
  <label for="engine-registration_no">Registration No</label><input name="engine-registration_no" type="text" value="abc-123" /> 
  <label for="engine-time_in_service">Time in service</label><input name="engine-time_in_service" type="text" value="6543.1" /> 
  <label for="engine-time_since_overhaul">Time since overhaul</label><input name="engine-time_since_overhaul" type="text" value="876.2" /> 
  <label for="engine-notes">Notes</label><input name="engine-notes" type="text" value="" /> 
</div>
  <button id="btn-engine-add" type="button" value="Add">Add</button>
  <button id="btn-engine-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-engine-attach" type="button" value="Attach">Attach</button>
  <button id="btn-engine-detach" type="button" value="Detach">Detach</button>
  <button id="btn-engine-delete" type="button" value="Delete">Delete</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-engine"></code></pre>

::left margin-.1 box id-staged-engine cl-staged::<div>
Engine Notes
</div>

::clear box id-msg-engine::This area will contain information, confirmations, and error messages about activities done on the form.

::blue tx-center box:: Workorder Records

### Workorders
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
  <button id="btn-workorder-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-workorder-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-workorder-next" type="button" value="Next">Next</button>
  <button id="btn-workorder-prev" type="button" value="Prev">Prev</button>
  <button id="btn-workorder-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="workorder-form" class="settings">
  <label for="workorder-company_id">*Company</label><select name="workorder-company_id">
    <option value="default">default</option>
    <option value="a11y-dark">a11y-dark</option>
    <option value="a11y-light">a11y-light</option>
  </select>
 <label for="workorder-aircraft_id">*Aircraft</label><select name="workorder-aircraft_id">
    <option value="default">default</option>
    <option value="a11y-dark" selected>a11y-dark</option>
    <option value="a11y-light">a11y-light</option>
  </select>
  <label for="workorder-workorder_no">*Workorder No</label><input name="workorder-workorder_no" type="text" value="LCA_1234" /> 
  <label for="workorder-name">*Name</label><input name="workorder-name" type="text" value="LCA_1234" /> 
  <label for="workorder-date">Date</label><input name="workorder-date" type="text" value="08/11/2020" /> 
  <label for="workorder-preliminary_inspection">Preliminary Inspection</label><input name="workorder-preliminary_inspection" type="text" value="Torked" />
  <label for="workorder-hidden_damage_inspection">Hidden Damage Inspection</label><input name="workorder-hidden_damage_inspection" type="text" value="1234-xyz" /> 
  <label for="workorder-in_progress_inspection">In Progress Inspection</label><input name="workorder-in_progress_inspection" type="text" value="abc-123" /> 
  <label for="workorder-start_date">Start Date</label><input name="workorder-start_date" type="text" value="6543.1" /> 
  <label for="workorder-completed_date">Completed Date</label><input name="workorder-completed_date" type="text" value="6543.1" /> 
  <label for="workorder-signed_date">Signed Date</label><input name="workorder-signed_date" type="text" value="" /> 
  <label for="workorder-notes">Notes</label><input name="workorder-notes" type="text" value="" /> 
</div>
  <button id="btn-workorder-add" type="button" value="Add">Add</button>
  <button id="btn-workorder-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-workorder-company" type="button" value="Company">Company</button>
  <button id="btn-workorder-aircraft" type="button" value="Aircraft">Aircraft</button>
  <button id="btn-workorder-task" type="button" value="Tasks">Tasks</button>
	<hr>
  <button id="btn-workorder-attach" type="button" value="Attach">Attach</button>
  <button id="btn-workorder-detach" type="button" value="Detach">Detach</button>
  <button id="btn-workorder-delete" type="button" value="Delete">Delete</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-workorder"></code></pre>

::left margin-.1 box id-staged-workorder cl-staged::<div>
Workorder Notes
</div>

::clear box id-msg-workorder::This area will contain information, confirmations, and error messages about activities done on the form.

#### Tasks
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
  <button id="btn-task-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-task-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-task-next" type="button" value="Next">Next</button>
  <button id="btn-task-prev" type="button" value="Prev">Prev</button>
  <button id="btn-task-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="task-form" class="settings">
  <label for="task-workorder_id">*Workorder</label><select name="task-workorder_id">
    <option value="default">default</option>
    <option value="a11y-dark">a11y-dark</option>
    <option value="a11y-light">a11y-light</option>
  </select>
   <label for="task-name">*Name</label><input name="task-name" type="text" value="Broke thingmabob" /> 
  <label for="task-discrepancy">*Discrepancy</label><input name="task-discrepancy" type="text" value="An editor will open" /> 
  <label for="task-removed_pn">Removed PN</label><input name="task-removed_pn" type="text" value="dfg-3e1" /> 
  <label for="task-removed_sn">Removed SN</label><input name="task-removed_sn" type="text" value="1234_xyz.42" /> 
  <label for="task-corrective_action">Corrective Action</label><input name="task-corrective_action" type="text" value="abc-123" /> 
  <label for="task-installed_pn">Installed PN</label><input name="task-installed_pn" type="text" value="new-dfg-3e1" /> 
  <label for="task-installed_sn">Installed SN</label><input name="task-installed_sn" type="text" value="newer-1234-xyz.42" /> 
  <label for="task-time">Time</label><input name="task-time" type="text" value="6543.1" /> 
  <label for="task-corrected_by">Corrected by</label><input name="task-corrected_by" type="text" value="Daffy Duck" /> 
  <label for="task-inspected_by">Inspected by</label><input name="task-inspected_by" type="text" value="Bugs Bunny" /> 
  <label for="task-notes">Notes</label><input name="task-notes" type="text" value="" /> 
</div>
  <button id="btn-task-add" type="button" value="Add">Add</button>
  <button id="btn-task-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-task-associate" type="button" value="Associates">Associates</button>
  <hr>
  <button id="btn-task-attach" type="button" value="Attach">Attach</button>
  <button id="btn-task-detach" type="button" value="Detach">Detach</button>
  <button id="btn-task-delete" type="button" value="Delete">Delete</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-task"></code></pre>

::left margin-.1 box id-staged-task cl-staged::<div>
Tasks Notes
</div>

::clear box id-msg-task::This area will contain information, confirmations, and error messages about activities done on the form.

##### Associates
::cl-description::<div>

An associate is someone who is responsible for performing tasks that have been assigned to a workorder. The task can have multiple associates assigned to the task, such as a mechanic doing work, an inspector, a person that signs off work as completed. See [Task](#task) below.

Normally an associate is an employee, or a company contracted for labor, an inspector,
or a government regulator.

</div>

::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
  <button id="btn-associate-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
  <button id="btn-associate-find" class="btn-enabled" type="button" value="Find">Find</button>
  <button id="btn-associate-next" type="button" value="Next">Next</button>
  <button id="btn-associate-prev" type="button" value="Prev">Prev</button>
  <button id="btn-associate-stage" type="button" value="Stage">Stage</button>
  <hr>
<div id="associate-form" class="settings">
  <label for="associate-task_ids">Tasks</label><select name="associate-task_ids">
    <option value="default">default</option>
    <option value="a11y-dark">a11y-dark</option>
    <option value="a11y-light">a11y-light</option>
  </select>
  <label for="associate-name">*Name</label><input name="associate-name" type="text" value="Bob Toolbelt" /> 
  <label for="associate-address">Address</label><input name="associate-address" type="text" value="123 Right Turn Street" /> 
  <label for="associate-city">City</label><input name="associate-city" type="text" value="Cottageville" /> 
  <label for="associate-state">State</label><input name="associate-state" type="text" value="SC" /> 
  <label for="associate-zip">Zip</label><input name="associate-zip" type="text" value="29435" /> 
  <label for="associate-phone">Phone</label><input name="associate-phone" type="text" value="8435551212" /> 
  <label for="associate-email">Email</label><input name="associate-email" type="text" value="sillybob@mailserver.com" /> 
  <label for="asssociate-notes">Notes</label><input name="associate-notes" type="text" value="" /> 
</div>
  <button id="btn-associate-add" type="button" value="Add">Add</button>
  <button id="btn-associate-update" type="button" value="Update">Update</button>
  <hr>
  <button id="btn-associate-attach" type="button" value="Attach">Attach</button>
  <button id="btn-associate-detach" type="button" value="Detach">Detach</button>
  <button id="btn-associate-delete" type="button" value="Delete">Delete</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-associate"></code></pre>

::left margin-.1 box id-staged-associate cl-staged::<div>
Associate Notes
</div>

::clear box id-msg-associate::This area will contain information, confirmations, and error messages about activities done on the form.


<style>
div.settings {
  display:grid;
  grid-template-columns: max-content max-content;
  grid-gap:5px;
  margin-bottom: 1em;  
}
div.settings label       { text-align:right; }
div.settings label:after { content: ":"; }

button.btn-enabled { opacity: 1; }

.schema { display: none; }

.CodeMirror {
  font-family: monospace;
  font-size: .8em;
  line-height: 24px;
  white-space: pre-wrap;
  height: auto;
}

</style>

::insert-pages/proposal/database.js::

::comment:: Styles and scripts for codemirror editor
::insert-pages/from/codemirror/editor.md::

Author: PotOfCoffee2Go
Created: Aug. 9, 2020
Updated: Aug. 17, 2020
Copyright: (c) 2020 Lowcountry Aviation - All Rights reserved.
::comment:: License:
