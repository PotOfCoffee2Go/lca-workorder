# LCA Work Order Data Server

commands
  - /any/:find
  - /workorder/:find
  - /company/:find
  - /contact/:find
  - /associate/:find
  - /aircraft/:find
  - /engine/:find
  - /task/:find
  - /workorder/:find

:find can be 
  - _id of the record on the database
  - Find object of matching `{ name: 'Name your looking for', otherfields... }`
  - Find using wildcards '*' and or '?' 
  - Find using RegEx expression

By default data is returned as HTML table
CSV is returned if HTTP header has "content-type: text/csv"
JSON is returned if HTTP header has "application/json"
