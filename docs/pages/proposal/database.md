# Proposed Database Records

::tx-.7::<input id="show-records" type="button" value="Show DB Records"/>

::blue tx-center box:: Company Records

## Contact
A contact contains information about any person that Lowcountry Aviation might want to, well... contact. Contacts are usually assigned to a [Company](#company) record.

::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
<div id="contact-form" class="settings">
	<label for="contact-name">Name</label>
	<input name="contact-name" type="text" value="Frank" /> 
	<label for="contact-address">Address</label>
	<input name="contact-address" type="text" value="111 Dead End Ave." /> 
	<label for="contact-city">City</label>
	<input name="contact-city" type="text" value="Cottageville" /> 
	<label for="contact-state">State</label>
	<input name="contact-state" type="text" value="SC" /> 
	<label for="contact-zip">Zip</label>
	<input name="contact-zip" type="text" value="29435" /> 
	<label for="contact-phone">Phone</label>
	<input name="contact-phone" type="text" value="8435551212" /> 
	<label for="contact-email">Email</label>
	<input name="contact-email" type="text" value="silly@mailserver.com" /> 
</div>
	<hr>
	<button id="btn-contact-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
	<button id="btn-contact-find" class="btn-enabled" type="button" value="Find">Find</button>
	<button id="btn-contact-add" type="button" value="Add">Add</button>
	<button id="btn-contact-update" type="button" value="Update">Update</button>
	<button id="btn-contact-delete" type="button" value="Delete">Delete</button>
	<br />
	<button id="btn-contact-back" type="button" value="Back">Back</button>
	<button id="btn-contact-prev" type="button" value="Prev">Prev</button>
	<button id="btn-contact-next" type="button" value="Next">Next</button>
	<br />
	<button id="btn-contact-attach" type="button" value="Attach">Attach</button>
	<button id="btn-contact-detach" type="button" value="Detach">Detach</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-contact"></code></pre>

::clear box::This area will contain information, confirmations, and error messages about activities done on the form.

## Engine
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
<div id="engine-form" class="settings">
	<label for="engine-model">Model</label>
	<input name="engine-model" type="text" value="A big boy" /> 
	<label for="engine-make">Make</label>
	<input name="engine-make" type="text" value="Torked" /> 
	<label for="engine-serial-no">Serial No</label>
	<input name="engine-serial-no" type="text" value="1234-xyz" /> 
	<label for="engine-registration-no">Registration No</label>
	<input name="engine-registration-no" type="text" value="abc-123" /> 
	<label for="engine-time-in-service">Time in service</label>
	<input name="engine-time-in-service" type="text" value="6543.1" /> 
	<label for="engine-time-since-overhaul">Time since overhaul</label>
	<input name="engine-time-since-overhaul" type="text" value="876.2" /> 
</div>
	<hr>
	<button id="btn-engine-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
	<button id="btn-engine-find" class="btn-enabled" type="button" value="Find">Find</button>
	<button id="btn-engine-add" type="button" value="Add">Add</button>
	<button id="btn-engine-update" type="button" value="Update">Update</button>
	<button id="btn-engine-delete" type="button" value="Delete">Delete</button>
	<br />
	<button id="btn-engine-back" type="button" value="Back">Back</button>
	<button id="btn-engine-prev" type="button" value="Prev">Prev</button>
	<button id="btn-engine-next" type="button" value="Next">Next</button>
	<br />
	<button id="btn-engine-attach" type="button" value="Attach">Attach</button>
	<button id="btn-engine-detach" type="button" value="Detach">Detach</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-engine"></code></pre>

::clear box::This area will contain information, confirmations, and error messages about activities done on the form.

## Aircraft
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
<div id="aircraft-form" class="settings">
	<label for="aircraft-model">Model</label>
	<input name="aircraft-model" type="text" value="A big boy" /> 
	<label for="aircraft-make">Make</label>
	<input name="aircraft-make" type="text" value="Torked" /> 
	<label for="aircraft-serial-no">Serial No</label>
	<input name="aircraft-serial-no" type="text" value="1234-xyz" /> 
	<label for="aircraft-registration-no">Registration No</label>
	<input name="aircraft-registration-no" type="text" value="abc-123" /> 
	<label for="aircraft-time-in-service">Time in service</label>
	<input name="aircraft-time-in-service" type="text" value="6543.1" /> 
</div>
	<button id="btn-aircraft-engines" type="button" value="Engines">Engines</button>
	<hr>
	<button id="btn-aircraft-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
	<button id="btn-aircraft-find" class="btn-enabled" type="button" value="Find">Find</button>
	<button id="btn-aircraft-add" type="button" value="Add">Add</button>
	<button id="btn-aircraft-update" type="button" value="Update">Update</button>
	<button id="btn-aircraft-delete" type="button" value="Delete">Delete</button>
	<br />
	<button id="btn-aircraft-back" type="button" value="Back">Back</button>
	<button id="btn-aircraft-prev" type="button" value="Prev">Prev</button>
	<button id="btn-aircraft-next" type="button" value="Next">Next</button>
	<br />
	<button id="btn-aircraft-attach" type="button" value="Attach">Attach</button>
	<button id="btn-aircraft-detach" type="button" value="Detach">Detach</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-aircraft"></code></pre>

::clear box::This area will contain information, confirmations, and error messages about activities done on the form.

## Company
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
<div id="company-form" class="settings">
	<label for="company-name">Name</label>
	<input name="company-name" type="text" value="Fly by Night, LLC" /> 
	<label for="company-address">Address</label>
	<input name="company-address" type="text" value="999 Ut-Oh Way" /> 
	<label for="company-city">City</label>
	<input name="company-city" type="text" value="Cottageville" /> 
	<label for="company-state">State</label>
	<input name="company-state" type="text" value="SC" /> 
	<label for="company-zip">Zip</label>
	<input name="company-zip" type="text" value="29435" /> 
	<label for="company-phone">Phone</label>
	<input name="company-phone" type="text" value="8435551212" /> 
	<label for="company-email">Email</label>
	<input name="company-email" type="text" value="freestick@mailserver.com" /> 
</div>
	<button id="btn-company-contacts" type="button" value="Contacts">Contacts</button>
	<button id="btn-company-aircrafts" type="button" value="Aircrafts">Aircrafts</button>
	<button id="btn-company-workorders" type="button" value="Workorders">Workorders</button>
	<hr>
	<button id="btn-company-clear"  class="btn-enabled" type="button" value="Clear">Clear</button>
	<button id="btn-company-find" class="btn-enabled" type="button" value="Find">Find</button>
	<button id="btn-company-add" type="button" value="Add">Add</button>
	<button id="btn-company-update" type="button" value="Update">Update</button>
	<button id="btn-company-delete" type="button" value="Delete">Delete</button>
	<br />
	<button id="btn-company-back" type="button" value="Back">Back</button>
	<button id="btn-company-prev" type="button" value="Prev">Prev</button>
	<button id="btn-company-next" type="button" value="Next">Next</button>
	<br />
	<button id="btn-company-attach" type="button" value="Attach">Attach</button>
	<button id="btn-company-detach" type="button" value="Detach">Detach</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-company"></code></pre>

::clear box::This area will contain information, confirmations, and error messages about activities done on the form.

::blue tx-center box:: Workorder Records

## Associate
An associate is someone who is responsible for performing tasks that have been assigned to a workorder. The task can have multiple associates assigned to the task, such as a mechanic doing work, an inspector, a person that signs off work as completed. See [Task](#task) below.

Normally an associate is an employee, or a company contracted for labor, an inspector,
or a government regulator.

::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
<div id="associate-form" class="settings">
	<label for="associate-name">Name</label>
	<input name="associate-name" type="text" value="Bob Toolbelt" /> 
	<label for="associate-address">Address</label>
	<input name="associate-address" type="text" value="123 Right Turn Street" /> 
	<label for="associate-city">City</label>
	<input name="associate-city" type="text" value="Cottageville" /> 
	<label for="associate-state">State</label>
	<input name="associate-state" type="text" value="SC" /> 
	<label for="associate-zip">Zip</label>
	<input name="associate-zip" type="text" value="29435" /> 
	<label for="associate-phone">Phone</label>
	<input name="associate-phone" type="text" value="8435551212" /> 
	<label for="associate-email">Email</label>
	<input name="associate-email" type="text" value="sillybob@mailserver.com" /> 
</div>
	<hr>
	<button id="btn-associate-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
	<button id="btn-associate-find" class="btn-enabled" type="button" value="Find">Find</button>
	<button id="btn-associate-add" type="button" value="Add">Add</button>
	<button id="btn-associate-update" type="button" value="Update">Update</button>
	<button id="btn-associate-delete" type="button" value="Delete">Delete</button>
	<br />
	<button id="btn-associate-back" type="button" value="Back">Back</button>
	<button id="btn-associate-prev" type="button" value="Prev">Prev</button>
	<button id="btn-associate-next" type="button" value="Next">Next</button>
	<br />
	<button id="btn-associate-attach" type="button" value="Attach">Attach</button>
	<button id="btn-associate-detach" type="button" value="Detach">Detach</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-associate"></code></pre>

::clear box::This area will contain information, confirmations, and error messages about activities done on the form.

## Task
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
<div id="task-form" class="settings">
	<label for="task-discrepancy">Discrepancy</label>
	<input name="task-discrepancy" type="text" value="An editor will open" /> 
	<label for="task-removed-pn">Removed PN</label>
	<input name="task-removed-pn" type="text" value="dfg-3e1" /> 
	<label for="task-removed-sn">Removed SN</label>
	<input name="task-removed-sn" type="text" value="1234-xyz.42" /> 
	<label for="task-corrective-action">Corrective Action</label>
	<input name="task-corrective-action" type="text" value="abc-123" /> 
	<label for="task-installed-pn">Installed PN</label>
	<input name="task-installed-pn" type="text" value="new-dfg-3e1" /> 
	<label for="task-installed-sn">Installed SN</label>
	<input name="task-installed-sn" type="text" value="newer-1234-xyz.42" /> 
	<label for="task-time">Time</label>
	<input name="task-time" type="text" value="6543.1" /> 
	<label for="task-corrected-by">Corrected by</label>
	<input name="task-corrected-by" type="text" value="Bugs Bunny" /> 
	<label for="task-inspected-by">Inspected by</label>
	<input name="task-inspected-by" type="text" value="Bugs Bunny" /> 
</div>
	<button id="btn-task-associates" type="button" value="Associates">Associates</button>
	<hr>
	<button id="btn-task-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
	<button id="btn-task-find" class="btn-enabled" type="button" value="Find">Find</button>
	<button id="btn-task-add" type="button" value="Add">Add</button>
	<button id="btn-task-update" type="button" value="Update">Update</button>
	<button id="btn-task-delete" type="button" value="Delete">Delete</button>
	<br />
	<button id="btn-task-back" type="button" value="Back">Back</button>
	<button id="btn-task-prev" type="button" value="Prev">Prev</button>
	<button id="btn-task-next" type="button" value="Next">Next</button>
	<br />
	<button id="btn-task-attach" type="button" value="Attach">Attach</button>
	<button id="btn-task-detach" type="button" value="Detach">Detach</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-task"></code></pre>

::clear box::This area will contain information, confirmations, and error messages about activities done on the form.

## Workorder
::box::<div>Information about current workorder/company/aircraft</div>

::left box margin-0-1::<div>
<div id="workorder-form" class="settings">
	<label for="workorder-no">Workorder No</label>
	<input name="workorder-no" type="text" value="LCA-1234" /> 
	<label for="workorder-date">Date</label>
	<input name="workorder-date" type="text" value="08/11/2020" /> 
	<label for="workorder-preliminary-inspection">Preliminary Inspection</label>
	<input name="workorder-preliminary-inspection" type="text" value="Torked" /> 
	<label for="workorder-hidden-damage-inspection">Hidden Damage Inspection</label>
	<input name="workorder-hidden_damage_inspection" type="text" value="1234-xyz" /> 
	<label for="workorder-in-progress-inspection">In Progress Inspection</label>
	<input name="workorder-in-progress-inspection" type="text" value="abc-123" /> 
	<label for="workorder-start-date">Start Date</label>
	<input name="workorder-start-date" type="text" value="6543.1" /> 
	<label for="workorder-completed-date">Completed Date</label>
	<input name="workorder-completed-date" type="text" value="6543.1" /> 
	<label for="workorder-signed-date">Signed Date</label>
	<input name="workorder-signed-date" type="text" value="" /> 
</div>
	<button id="btn-workorder-company" type="button" value="Company">Company</button>
	<button id="btn-workorder-aircraft" type="button" value="Aircraft">Aircraft</button>
	<button id="btn-workorder-tasks" type="button" value="Tasks">Tasks</button>
	<hr>
	<button id="btn-workorder-clear" class="btn-enabled" type="button" value="Clear">Clear</button>
	<button id="btn-workorder-find" class="btn-enabled" type="button" value="Find">Find</button>
	<button id="btn-workorder-add" type="button" value="Add">Add</button>
	<button id="btn-workorder-update" type="button" value="Update">Update</button>
	<button id="btn-workorder-delete" type="button" value="Delete">Delete</button>
	<br />
	<button id="btn-workorder-prev" type="button" value="Prev">Prev</button>
	<button id="btn-workorder-next" type="button" value="Next">Next</button>
</div>

::left margin-.1 box cl-schema::<pre><code id="schema-workorder"></code></pre>

::clear box::This area will contain information, confirmations, and error messages about activities done on the form.

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
</style>

<script>
  document.getElementById("show-records").addEventListener("click", () => {
		var allDbSchema = document.querySelectorAll('.schema');
		for (var i=0, len=allDbSchema.length|0; i<len; i=i+1|0) {
			if (allDbSchema[i].style.display === 'block') {
				allDbSchema[i].style.display = 'none';
        document.getElementById('show-records').value = "Show DB Records"
			} else {
				allDbSchema[i].style.display = 'block';
        document.getElementById('show-records').value = "Hide DB Records"
			}
		}
  }, false);
  
	const buttons = document.querySelectorAll("div button")
	for (const button of buttons) {
		button.addEventListener('click', function(evt) {
			alert(evt.target.id);
		})
	}  
  

   poc2go.fetch.json('server/rest/api/models/workorderModel.json')
   .then(json => {
     document.getElementById('schema-associate').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.associate, null, 2)).value;
     document.getElementById('schema-contact').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.contact, null, 2)).value;
     document.getElementById('schema-company').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.company, null, 2)).value;
     document.getElementById('schema-engine').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.engine, null, 2)).value;
     document.getElementById('schema-aircraft').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.aircraft, null, 2)).value;
     document.getElementById('schema-task').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.task, null, 2)).value;
     document.getElementById('schema-workorder').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.workorder, null, 2)).value;
   });



</script>

Author: PotOfCoffee2Go
Created: Aug. 9, 2020
Updated: Aug. 12, 2020
License: MIT
