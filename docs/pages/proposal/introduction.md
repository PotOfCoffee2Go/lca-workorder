# LCA Work Order Flow Proposal

Lowcountry Aviation is currently using Adobe ::blue::_pdf_ forms to record and process work orders. Microsoft ::blue::_docx_ files are used to report the current status of the work orders. The overhead of filling out and maintaining the forms has become burdensome for the company. This proposal is to discuss a web based, open sourse solution to streamline and track Lowcountry Aviation's work order flow processing.

## Web based access
Individuals with proper credentials will be able to access, add, update, and resolve open work orders. The four levels of security are:
 - ::tx-green::_get_ - read only
 - ::tx-aliceblue::_insert_ - add new work order
 - ::tx-cyan::_update_ - change or resolve work order
 - ::tx-red::_delete_ - remove work order

The database of work orders can be accessed/updated via cell phone, tablet, or computer. Each transaction (get, insert, update, or delete) is recorded in an audit/transaction log containing the user and device accessing the work order.

## Open vs Closed work orders
For performance and scalability the data storage is divided into two databases:
 - ::tx-cyan::_Open work orders_
   - Can be modified as work in progress
 - ::tx-cyan::_Resolved (or closed) work orders_
   - No changes are allowed
   - Info can be used to generate new work order
 
Basically, once a work order has been flagged as closed it can not be ::tx-pink::_unclosed_. However, a new work order can be generated auto-filling fields from the closed work order.
> ::tx-gray::Note that the ability to generate a new work order from an existing work order is key to reducing redundant data entry. The work order company, address, aircraft, etc. is automatically filled in. 

## Work order transactions
This project is to record and search work orders. The system logs all ::tx-green::_get_, ::tx-aliceblue::_insert_, ::tx-cyan::_update_, and ::tx-red::_delete_ transactions in a [JSON][] formatted audit log. The log can be used directly or to update a SQL database (mysql, oracle, mssql) or non-SQL database (mongo, mongouse, neDB, etc.) of Lowcountry Aviation's choosing. Updating a database is a separate project.

A transaction represents a distinct unit of work. A work order is a group of transactions. To create ::tx-aliceblue::_(insert)_ a workorder a customer id is required, the new workorder id will be automatically generated. Transactions can the be added to the newly created work order. Transactions can be copied from previous work orders. This is handy for routine/scheduled maintenance work orders.

Each transaction requires a custmer account number and work order id. Any number of transactions can be applied to a work order. Other than a valid customer/workorderId, the storage system does not verify the data being stored. This allows new data fields to be added or obsolete fields to be removed without requiring changes to the storage system.

## Implementation
Work order forms can be inserted onto any web page by adding a script like :
``` html
  <script src="https://lowcountryaviation.com/js/workorders.js"></script>
```

and a `<div>` where the work order is to appear on the page:
``` html
  <div id="lca-workorder"></div>
```
The script will insert work order info inside the div. There are properties that can be included in the `<div>` statement to refine the work orders to be displayed.

## Web host
Development is using [github][] as a web host. Lowcountry Aviation will probably wish to host the code and data on their own web host. This is easily done using ::tx-aqua::_`git clone git@github.com:PotOfCoffee2Go/lca-workorder.git`_ command to download onto their host server. The host server will require [nodejs][] installed to store the work order data.

## Database records

<style>
form.settings {
    display:grid;
    grid-template-columns: max-content max-content;
    grid-gap:5px;
}
form.settings label       { text-align:right; }
form.settings label:after { content: ":"; }

</style>

### Contact
A contact contains information about any person that Lowcountry Aviation might want to, well... contact. Contacts are usually assigned to a [Company](#company) record.

::left margin-.1-1 box::<pre><code id="schema-contact"></code></pre>

<form class="settings" accept-charset="UTF-8" action="action_page.php" autocomplete="off" method="GET" target="_blank">
	<label for="name">Name</label>
	<input name="name" type="text" value="Frank" /> 
	<label for="address">Address</label>
	<input name="address" type="text" value="111 Some Street" /> 
	<label for="city">City</label>
	<input name="city" type="text" value="Cottageville" /> 
	<label for="state">State</label>
	<input name="state" type="text" value="SC" /> 
	<label for="zip">Zip</label>
	<input name="zip" type="text" value="29435" /> 
	<label for="phone">Phone</label>
	<input name="phone" type="text" value="8435551212" /> 
	<label for="email">Email</label>
	<input name="email" type="text" value="silly@mailserver.com" /> 
	<select>
		<option selected="selected" value="1">Yes</option>
		<option value="2">No</option>
	</select>
	<input name="democheckbox" type="checkbox" value="1" /> Checkbox
	<button type="submit" value="Submit">Submit</button>
</form>

::clear padding-1::<hr>

### Associate
An associate is someone who is responsible for performing tasks that have been assigned to a workorder. The task can have multiple associates assigned to the task, such as a mechanic doing work, an inspector, a person that signs off work as completed. See [Task](#task) below.

::left margin-.1-1 box::<pre><code id="schema-associate"></code></pre>

Normally an associate is an employee, or a company contracted for labor, an inspector,
or a government regulator.

::clear padding-1::<hr>

### Company
::left margin-.1-1 box::<pre><code id="schema-company"></code></pre>

::clear padding-1::<hr>

### Engine
::left margin-.1-1 box::<pre><code id="schema-engine"></code></pre>

::clear padding-1::<hr>

### Craft
::left margin-.1-1 box::<pre><code id="schema-craft"></code></pre>

::clear padding-1::<hr>

### Task
::left margin-.1-1 box::<pre><code id="schema-task"></code></pre>

::clear padding-1::<hr>

### Workorder
::left margin-.1-1 box::<pre><code id="schema-workorder"></code></pre>

::clear padding-1::<hr>

<script>
   poc2go.fetch.json('http://localhost:8000/schema')
   .then(json => {
     document.getElementById('schema-associate').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.associate, null, 2)).value;
     document.getElementById('schema-contact').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.contact, null, 2)).value;
     document.getElementById('schema-company').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.company, null, 2)).value;
     document.getElementById('schema-engine').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.engine, null, 2)).value;
     document.getElementById('schema-craft').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.craft, null, 2)).value;
     document.getElementById('schema-task').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.task, null, 2)).value;
     document.getElementById('schema-workorder').innerHTML = 
      hljs.highlight('json', JSON.stringify(json.schema.workorder, null, 2)).value;

   });
</script>


[JSON]: https://www.json.org
