# LCA Work Order Flow Proposal

Lowcountry Aviation is currently using Adobe ::tx-aqua::_pdf_ forms to record and process work orders. Microsoft ::tx-aqua::_docx_ files are used to report the current status of the work orders. The overhead of filling out and maintaining the forms has become burdensome for the company. This proposal is to discuss a web based, open sourse solution to streamline and track Lowcountry Aviation's work order flow processing.

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
Work order forms can be inserted onto any web page by adding a script like

```html
  <script src="https://lowcountryaviation.com/js/workorders.js"></script>
```

and a `<div>` where the work order is to appear on the page

```html
  <div id="lca-workorder"></div>
```

The script will insert work order info inside the div. There are properties that can be included in the `<div>` statement to refine the work orders to be displayed.

## Web host
Development is using [github][] as a web host. Lowcountry Aviation will probably wish to host the code and data on their own web host. This is easily done using ::tx-aqua::_git clone git@github.com:PotOfCoffee2Go/lca-workorder.git_ command to download onto their host server. The host server will require [nodejs][] installed to store the work order data.

Author: PotOfCoffee2Go
Created: Aug. 9, 2020
Updated: Aug. 11, 2020
License: MIT


[github]: https://www.github.com
[nodejs]: https://www.nodejs.org
[JSON]: https://www.json.org
