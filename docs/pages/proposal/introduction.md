# LCA Work Order Flow Proposal

Lowcountry Aviation is currently using Adobe ::blue::_pdf_ forms to record and process work orders. Microsoft ::blue::_docx_ files are used to report the current status of the work orders. The overhead of filling out and maintaining the forms has become burdensome for the company. This proposal is the discuss a web based, open sourse solution to streamline and track Lowcountry Aviation's work order flow processing.

## Web based access
Individuals with proper credentials will be able to access, add, update, and resolve open work orders. The four levels of security are:
 - ::tx-green::_get_ - read only
 - ::tx-aliceblue::_insert_ - add new work order
 - ::tx-cyan::_update_ - change or resolve work order
 - ::tx-red::_delete_ - remove work order

The database of work orders can be accessed/updated via cell phone, tablet, or computer. Each transaction (get, insert, update, or delete) is recorded in an audit log containing the user and device accessing the work order.

## Open vs Closed work orders
For performance and scalability the data storage is divided into two databases:
 - ::tx-cyan::_Open work orders_
   - Can be modified as work in progress
 - ::tx-cyan::_Resolved (or closed) work orders_
   - No changes are allowed
   - Info can be used to generate new work order
 
Basically, once a work order has been flagged as closed it can not be ::tx-pink::_unclosed_. However, a new work order can be generated auto-filling fields from the closed work order.
> ::tx-gray::Note that the ability to generate a new work order from an existing work order is key to reducing redundant data entry. The work order company, address, aircraft, etc. is automatically filled in. 
