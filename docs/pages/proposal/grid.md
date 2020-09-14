# DB Grid

&nbsp;

::tx-center tx-1.5 cl-drpdown::<div>
Company <select id="company-dropdown"></select>
<select id="aircraft-dropdown"></select> Aircraft
</div>

::tx-center tx-1.5 cl-drpdown::<div>
Contacts <select id="contact-dropdown"></select>
<select id="engine-dropdown"></select> Engines
</div>

::tx-center tx-1.5 cl-drpdown::<div>
Work Orders <select id="workorder-dropdown"></select>
<select id="task-dropdown"></select>
<select id="associate-dropdown"></select>
</div>

::tx-center::
<button class="grid-content" value="company" type="button">Companies</button>
<button class="grid-content" value="aircraft" type="button">Aircraft</button>
<button class="grid-content" value="contact" type="button">Contacts</button>
<button class="grid-content" value="engine" type="button">Engines</button>
<button class="grid-content" value="workorder" type="button">Work Orders</button>
<button class="grid-content" value="task" type="button">Tasks</button>
<button class="grid-content" value="associate" type="button">Associates</button>


::div-company::
::div-contact::
::div-aircraft::
::div-engine::
::div-workorder::
::div-task::
::div-associate::

<script>
  const dm = poc2go.dom;
  const active = { company: {} };
  const grids = [dm['company'], dm['contact'], dm['aircraft'], dm['engine'],
    dm['workorder'], dm['task'], dm['associate']];

  const forGrids = (fn) => { for (grid of grids) {fn(grid);} }

  forGrids((grid) => {grid.style.display = 'none'});
  
  var btnFontSize;
  var grid;
  var curType = 'company';
  var recType = {
    company: {
      fields: [
            { name: 'name', title: 'Name', type: 'text', width: 100 },
            { name: 'address', title: 'Address', type: 'text', width: 100 },
            { name: 'city', title: 'City', type: 'text', width: 100 },
            { name: 'state', title: 'State', type: 'text', width: 40 },
            { name: 'zip', title: 'Zip', type: 'text', width: 50 },
            { name: 'phone', title: 'Phone', type: 'text', width: 70 },
            { name: 'email', title: 'Email', type: 'text', width: 70 },
            { type: 'control' },
        ]
      },
    contact: {
      fields: [
            { name: 'name', title: 'Name', type: 'text', width: 100 },
            { name: 'address', title: 'Address', type: 'text', width: 150 },
            { name: 'city', title: 'City', type: 'text', width: 100 },
            { name: 'state', title: 'State', type: 'text', width: 10 },
            { name: 'zip', title: 'Zip', type: 'text', width: 50 },
            { name: 'phone', title: 'Phone', type: 'text', width: 80 },
            { name: 'email', title: 'Email', type: 'text', width: 80 },
            { type: 'control' },
        ]
      },
    associate: {
      fields: [
            { name: 'name', title: 'Name', type: 'text', width: 100 },
            { name: 'address', title: 'Address', type: 'text', width: 150 },
            { name: 'city', title: 'City', type: 'text', width: 100 },
            { name: 'state', title: 'State', type: 'text', width: 10 },
            { name: 'zip', title: 'Zip', type: 'text', width: 50 },
            { name: 'phone', title: 'Phone', type: 'text', width: 80 },
            { name: 'email', title: 'Email', type: 'text', width: 80 },
            { type: 'control' },
        ]
      },
    engine: {
      fields: [
            { name: 'name', title: 'Name', type: 'text', width: 100 },
            { name: 'model', title: 'Model', type: 'text', width: 100 },
            { name: 'make', title: 'Make', type: 'text', width: 100 },
            { name: 'time_in_service', title: 'TIS', type: 'text', width: 80 },
            { name: 'serial_no', title: 'Serial Nbr', type: 'text', width: 100 },
            { name: 'registration_no', title: 'Reg Nbr', type: 'text', width: 100 },
            { name: 'time_since_overhaul', title: 'TSO', type: 'text', width: 80 },
            { type: 'control' },
        ]
      },
    aircraft: {
      fields: [
            { name: 'name', title: 'Name', type: 'text', width: 100 },
            { name: 'model', title: 'Model', type: 'text', width: 100 },
            { name: 'make', title: 'Make', type: 'text', width: 100 },
            { name: 'serial_no', title: 'Serial Nbr', type: 'text', width: 100 },
            { name: 'registration_no', title: 'Reg Nbr', type: 'text', width: 100 },
            { name: 'time_in_service', title: 'TIS', type: 'text', width: 80 },
            { type: 'control' },
        ]
      },
    task: {
      fields: [
            { name: 'name', title: 'Name', type: 'text', width: 100 },
            { name: 'discrepancy', title: 'Discrepancy', type: 'textarea', width: 100 },
            { name: 'corrective_action', title: 'Corrective Action', type: 'textarea', width: 100 },
            { name: 'removed_pn', title: 'Removed PN', type: 'text', width: 100 },
            { name: 'removed_sn', title: 'Removed SN', type: 'text', width: 100 },
            { name: 'installed_pn', title: 'Installed PN', type: 'text', width: 100 },
            { name: 'installed_sn', title: 'Installed SN', type: 'text', width: 100 },
            { name: 'time', title: 'Time', type: 'text', width: 100 },
            { name: 'corrected_by', title: 'Corrected by', type: 'text', width: 80 },
            { name: 'inspected_by', title: 'Inspected by', type: 'text', width: 80 },
            { type: 'control' },
        ]
      },
    workorder: {
      fields: [
            { name: 'name', title: 'Name', type: 'text', width: 100 },
            { name: 'workorder_no', title: 'Workorder Nbr', type: 'text', width: 100 },
            { name: 'date', title: 'Date', type: 'text', width: 100 },
            { name: 'preliminary_inspection', title: 'Preliminary Inspection', type: 'text', width: 100 },
            { name: 'hidden_damage_inspection', title: 'Hidden Damage Inspection', type: 'text', width: 100 },
            { name: 'in_progress_inspection', title: 'In Progress Inspection', type: 'text', width: 100 },
            { name: 'start_date', title: 'Start Date', type: 'text', width: 80 },
            { name: 'completed_date', title: 'Completed Date', type: 'text', width: 80 },
            { name: 'signed_date', title: 'Signed Date', type: 'text', width: 80 },
            { type: 'control' },
        ]
      },
  }

const db = {
  loadData: async (filter) => {
    console.log('filter', filter);
    let qry = JSON.stringify(setFilter({type: curType}, filter));
    let response = await $.ajax({
      url: `https://lca.ngrok.io/json/qry/${qry}`,
      dataType: "json"
    });
    console.log(response);
    return response;
  },

  insertItem: async (item) => {
    item.type = curType;
    let response = await $.ajax({
      type: "POST",
      url: `https://lca.ngrok.io/json/qry/{}`,
      dataType: "json",
      data: item
    });
    console.log('rsp insert',response);
    updateLists(item);
    return response[0];
  },

  updateItem: async (item) => {
    let response = await $.ajax({
      type: "PUT",
      url: `https://lca.ngrok.io/json/qry/${item._id}`,
      dataType: "json",
      data: item
    });
    console.log('Update rsp', response);
    updateLists(item);
    return response[0];
  },

  deleteItem: async (item) => {
    let response = await $.ajax({
      type: "DELETE",
      url: `https://lca.ngrok.io/json/qry/${item._id}`,
      dataType: "json",
      data: item
    });
    console.log('delete rsp', response);
    return response;
  },
};

const stdGrid = {
  height: "auto",
  width: "100%",

  editing: true,
  inserting: true,
  filtering: true,
  sorting: true,
  paging: true,
  autoload: false,
  pageLoading:false,
  controller: db,
  fields: [],
  onItemEditing: (args) => {
    dm[`${args.item.type}-dropdown`].value = args.item._id;
    console.log('editing ', args.item.type, args.item.name);
    if (args.item.type === 'company') fetchCompany(args.item._id);
  }

};

  const selects = document.querySelectorAll('select');
  for (const select of selects) {
    select.addEventListener('change', function(evt) {
      let type = evt.target.id.split('-')[0];
      let id = evt.target.value;
      if (!id) return resetToAll();
      if (type === 'company') {
        fetchCompany(evt.target.value) 
      }
    
      if (type === 'aircraft') {
        let el = active.company.aircrafts.filter((item) => id === item._id);
        if (el.length) { active.aircraft = el[0]; setEngineOpts(el[0]); }
        else { active.aircraft = {engines: []}; setEngineOpts({ engines: [] }) }
      }
      if (type === 'engine') {
        let el = active.aircraft.engines.filter((item) => id === item._id);
        if (el.length) { active.engine = el[0]; /* setEngineOpts(el[0]);*/ }
        else { active.engine = {}; /* setEngineOpts({ engines: [] }); */ }
      }
      if (type === 'workorder') {
        let el = active.company.workorders.filter((item) => id === item._id);
        if (el.length) { active.workorder = el[0]; setTaskOpts(el[0]); }
        else { active.workorder = {tasks: []}; setTaskOpts({tasks: []}); }
      }
      if (type === 'task') {
        let el = active.workorder.tasks.filter((item) => id === item._id);
        if (el.length) { active.task = el[0]; setAssociateOpts(el[0]); }
        else { active.task = {associates: []}; setAssociateOpts({associates: []}); }
      }
/*
    let selected = {};
    forGrids((grid) => {
      selected[grid.id] = { id: dm[`${}-dropdown`].value, active:{}};
      if (grid.id === 'workorder') {
        selected['workorder'] = company.workorders.filter((item) => selected['workorder'].id === item.id)
      }
      if (grid.id === 'contact') {
        selected['contact'] = company.contacts.filter((item) => selected['contact'].id === item.id)
      }
    }


    
    setAircraftOpts(selected[active);
    setWorkorderOpts(company);
    setContactOpts(company);
    setEngineOpts(company.aircrafts.length ? company.aircrafts[0] : []);
    setTaskOpts(company.workorders.length ? company.workorders[0] : []);
    let assoc = {associates:[]};
    if (company.workorders.length && company.workorders[0].tasks.length)
      assoc = company.workorders[0].tasks[0];
    setAssociateOpts(assoc);

    forGrids((grid) => {
      if (grid.id !== 'company' && dm[`${grid.id}-dropdown`].options.length > 1) {
        dm[`${grid.id}-dropdown`].value = dm[`${grid.id}-dropdown`].options[1].value;
      }
    })
*/



    }, false)
  }

//      type: 'task', unscheduled: "" // TO-DO

  const buttons = document.querySelectorAll('.grid-content')
  btnFontSize = buttons[1].style.fontSize;
  for (const button of buttons) {
    button.addEventListener('click', function(evt) {
      curType = evt.target.value;
      $(`#${curType}`).jsGrid("loadData");
      for (const btn of buttons) {
        if (evt.target === btn) { btn.style.opacity = 1; btn.style.fontSize = '1.1em'; }
        else {  btn.style.opacity = .6; btn.style.fontSize = btnFontSize; }
      }
      forGrids((grid) => {grid.style.display = 'none'});
      dm[curType].style.display = 'block';
    }, false)
  }


const setFields = (type) => {
  return Object.assign({}, stdGrid, recType[type])
};

const setFilter = (stdQry, filter) => {
  if (typeof filter.name === 'undefined') return stdQry;
  for (const fld in filter) {if (!filter[fld]) delete filter[fld];}
  return Object.assign({}, stdQry, filter);
};


$(function() {
  forGrids((grid) => console.log(grid.id));
  forGrids((grid) => $(`#${grid.id}`).jsGrid(setFields(grid.id)));
  dm[curType].style.display = 'block';
 
  for (const button of buttons) {
    if (button.value === curType) { button.style.opacity = 1; button.style.fontSize = '1.1em'; }
  }
});

const listAll = (type) => {
poc2go.fetch.json(`${poc2go.config.lca.workorderDb}list/${type}`)
  .then(data => {
  let options = [`<option value=""></option>`];
  for (const item of data) {
    options.push(`<option value="${item._id}">${item.name}</option>`);
  }
  poc2go.dom[`${type}-dropdown`].innerHTML = options.join('\n');
})
}

const updateLists = (item) => {
  if (!item.type) return;
  let drpdwn = dm[`${item.type}-dropdown`]; if (!drpdwn) return;
  var option = document.createElement("option");
  option.text = item.name;
  drpdwn.options.add(option);
  if (drpdwn.value === '') {
    assignItem(item);
    drpdwn.value = item.name;
  }
}

const assignItem = async (item) => {
  if (['aircraft', 'workorder'].includes(item.type) && active.company._id) 
    item._company = active.company._id;
  if (['engine', 'workorder'].includes(item.type) && active.aircraft._id)
    item._aircraft = active.aircraft._id;
  if ('task' === item.type) {
    if (active.workorder._id) item._workorder = active.workorder._id;
    if (active.engine._id) item._engine = active.engine._id;
  }
  if ('contact' === item.type && active.company) {
      active.company._contacts.push(item._id);
      active.task._contacts = Array.from(new Set(active.task._contacts))
      await db.updateItem(active.company);
  }
  if ('associate' === item.type && active.task)  {
      active.task._associates.push(item._id);
      active.task._associates = Array.from(new Set(active.task._associates))
      await db.updateItem(active.task);
  }
  await db.updateItem(item);
  await fetchCompany(active.company._id);
}

const setAircraftOpts = (company) => {
  let options = [`<option value=""></option>`];;
  for (const el of company.aircrafts) {
      options.push(`<option value="${el._id}">${el.name}</option>`);
  }
  dm['aircraft-dropdown'].innerHTML = options;
}
const setWorkorderOpts = (company) => {
  let options = [`<option value=""></option>`];;
  for (const el of company.workorders) {
      options.push(`<option value="${el._id}">${el.name}</option>`);
  }
  dm['workorder-dropdown'].innerHTML = options;
}
const setContactOpts = (company) => {
  let options = [`<option value=""></option>`];;
  for (const el of company.contacts) {
      options.push(`<option value="${el._id}">${el.name}</option>`);
  }
  dm['contact-dropdown'].innerHTML = options;
}
const setEngineOpts = (aircraft) => {
  let options = [`<option value=""></option>`];;
  for (const el of aircraft.engines) {
      options.push(`<option value="${el._id}">${el.name}</option>`);
  }
  dm['engine-dropdown'].innerHTML = options;
}
const setTaskOpts = (workorder) => {
  let options = [`<option value=""></option>`];;
  for (const el of workorder.tasks) {
      options.push(`<option value="${el._id}">${el.name}</option>`);
  }
  dm['task-dropdown'].innerHTML = options;
}
const setAssociateOpts = (task) => {
  let options = [`<option value=""></option>`];;
  for (const el of task.associates) {
      options.push(`<option value="${el._id}">${el.name}</option>`);
  }
  dm['associate-dropdown'].innerHTML = options;
}

const fetchCompany = (id) => {
poc2go.fetch.json(`${poc2go.config.lca.workorderDb}json/company/${id}`)
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
    let company = active.company = data[0];
    dm['company-dropdown'].value = company._id;

    setAircraftOpts(company);
    setWorkorderOpts(company);
    setContactOpts(company);
    setEngineOpts({engines:[]});
    setTaskOpts({tasks:[]});
    setAssociateOpts({associates:[]});
//    setEngineOpts(company.aircrafts.length ? company.aircrafts[0] : []);
//    setTaskOpts(company.workorders.length ? company.workorders[0] : []);
//    let assoc = {associates:[]};
//    if (company.workorders.length && company.workorders[0].tasks.length)
//      assoc = company.workorders[0].tasks[0];
//    setAssociateOpts(assoc);
/*
    forGrids((grid) => {
      if (grid.id !== 'company' && dm[`${grid.id}-dropdown`].options.length > 1) {
        dm[`${grid.id}-dropdown`].value = dm[`${grid.id}-dropdown`].options[1].value;
      }
    })
*/

/*    
    for (const sel of grids) {
      active[sel.id]._id = '';
      if (sel.id === 'company') active['company']._id = dm['company-dropdown'].value;
      if (sel.id !== 'company' && dm[`${sel.id}-dropdown`].options.length > 1) {
        dm[`${sel.id}-dropdown`].value = dm[`${sel.id}-dropdown`].options[1].value;
        active[sel.id]._id = dm[`${sel.id}-dropdown`].options[1].value;
      }
    }
    for (const workorder of company.workorders) {
      for (const task of workorder.tasks) {
        if (task._id === active['task']._id) active['task'] = task;
      }
    }
*/    console.log('active', active);
  })
}

const resetToAll = () => {
  listAll('company');
  listAll('contact');
  listAll('aircraft');
  listAll('engine');
  listAll('workorder');
  listAll('task');
  listAll('associate');
}

resetToAll();

</script>


<style>
.drpdown { padding-top: .5em; }

textarea {
  position: relative;
/*  z-index: 50; */
  overflow-y: scroll;
}

/*
 * jsGrid v1.5.3 (http://js-grid.com)
 * (c) 2016 Artem Tabalin
 * Licensed under MIT (https://github.com/tabalinas/jsgrid/blob/master/LICENSE)
 */

.jsgrid-grid-header,
.jsgrid-grid-body,
.jsgrid-header-row > .jsgrid-header-cell,
.jsgrid-filter-row > .jsgrid-cell,
.jsgrid-insert-row > .jsgrid-cell,
.jsgrid-edit-row > .jsgrid-cell {
    border: 1px solid gray;
}

.jsgrid-header-row > .jsgrid-header-cell {
    border-top: 0;
}

.jsgrid-header-row > .jsgrid-header-cell,
.jsgrid-filter-row > .jsgrid-cell,
.jsgrid-insert-row > .jsgrid-cell {
    border-bottom: 0;
}

.jsgrid-header-row > .jsgrid-header-cell:first-child,
.jsgrid-filter-row > .jsgrid-cell:first-child,
.jsgrid-insert-row > .jsgrid-cell:first-child {
    border-left: none;
}

.jsgrid-header-row > .jsgrid-header-cell:last-child,
.jsgrid-filter-row > .jsgrid-cell:last-child,
.jsgrid-insert-row > .jsgrid-cell:last-child {
    border-right: none;
}

.jsgrid-header-row .jsgrid-align-right,
.jsgrid-header-row .jsgrid-align-left {
    text-align: center;
}

.jsgrid-grid-header {
    background: var(--clrbackgrnd);
}

.jsgrid-header-scrollbar {
    scrollbar-arrow-color: #f1f1f1;
    scrollbar-base-color: #f1f1f1;
    scrollbar-3dlight-color: #f1f1f1;
    scrollbar-highlight-color: #f1f1f1;
    scrollbar-track-color: #f1f1f1;
    scrollbar-shadow-color: #f1f1f1;
    scrollbar-dark-shadow-color: #f1f1f1;
}

.jsgrid-header-scrollbar::-webkit-scrollbar {
    visibility: hidden;
}

.jsgrid-header-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.jsgrid-header-sortable:hover {
    cursor: pointer;
    background: #fcfcfc;
}

.jsgrid-header-row .jsgrid-header-sort {
    background: #c4e2ff;
}

.jsgrid-header-sort:before {
    content: " ";
    display: block;
    float: left;
    width: 0;
    height: 0;
    border-style: solid;
}

.jsgrid-header-sort-asc:before {
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #009a67 transparent;
}

.jsgrid-header-sort-desc:before {
    border-width: 5px 5px 0 5px;
    border-color: #009a67 transparent transparent transparent;
}

.jsgrid-grid-body {
    border-top: none;
}

.jsgrid-cell {
    border: 1px solid gray;
}

.jsgrid-grid-body .jsgrid-row:first-child .jsgrid-cell,
.jsgrid-grid-body .jsgrid-alt-row:first-child .jsgrid-cell {
    border-top: none;
}

.jsgrid-grid-body .jsgrid-cell:first-child {
    border-left: none;
}

.jsgrid-grid-body .jsgrid-cell:last-child {
    border-right: none;
}

.jsgrid-row > .jsgrid-cell {
    background: var(--clrbackgrnd);
}

.jsgrid-alt-row > .jsgrid-cell {
    background: var(--clrbackgrnd);
}

.jsgrid-header-row > .jsgrid-header-cell {
    background: var(--clrbackgrnd);
}

.jsgrid-filter-row > .jsgrid-cell {
    background: var(--clrbackgrnd);
}

.jsgrid-insert-row > .jsgrid-cell {
    background: #1a3636;
}

.jsgrid-edit-row > .jsgrid-cell {
    background: #506473;
}

.jsgrid-selected-row > .jsgrid-cell {
    color: var(--clrheading);
    border-color: gray;
}

.jsgrid-nodata-row > .jsgrid-cell {
    background: var(--clrbackgrnd);
}

.jsgrid-invalid input,
.jsgrid-invalid select,
.jsgrid-invalid textarea {
    background: #ffe3e5;
    border: 1px solid #ff808a;
}

.jsgrid-pager-current-page {
    font-weight: bold;
}

.jsgrid-pager-nav-inactive-button a {
    color: #d3d3d3;
}

.jsgrid-button + .jsgrid-button {
    margin-left: 5px;
}

.jsgrid-button:hover {
    opacity: .5;
    transition: opacity 200ms linear;
}

.jsgrid .jsgrid-button {
    width: 16px;
    height: 16px;
    border: none;
    cursor: pointer;
    background-image: url(data:image/png;base64,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);
    background-repeat: no-repeat;
    background-color: transparent;
}

@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
    .jsgrid .jsgrid-button {
        background-image: url(data:image/png;base64,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);
        background-size: 24px 352px;
    }
}

.jsgrid .jsgrid-mode-button {
    width: 24px;
    height: 24px;
}

.jsgrid-mode-on-button {
    opacity: .5;
}

.jsgrid-cancel-edit-button { background-position: 0 0; width: 16px; height: 16px; }
.jsgrid-clear-filter-button { background-position: 0 -40px; width: 16px; height: 16px; }
.jsgrid-delete-button { background-position: 0 -80px; width: 16px; height: 16px; }
.jsgrid-edit-button { background-position: 0 -120px; width: 16px; height: 16px; }
.jsgrid-insert-mode-button { background-position: 0 -160px; width: 24px; height: 24px; }
.jsgrid-insert-button { background-position: 0 -208px; width: 16px; height: 16px; }
.jsgrid-search-mode-button { background-position: 0 -248px; width: 24px; height: 24px; }
.jsgrid-search-button { background-position: 0 -296px; width: 16px; height: 16px; }
.jsgrid-update-button { background-position: 0 -336px; width: 16px; height: 16px; }


.jsgrid-load-shader {
    background: #ddd;
    opacity: .5;
    filter: alpha(opacity=50);
}

.jsgrid-load-panel {
    width: 15em;
    height: 5em;
    background: var(--clrbackgrnd);
    border: 1px solid gray;
    padding-top: 3em;
    text-align: center;
}

.jsgrid-load-panel:before {
    content: ' ';
    position: absolute;
    top: .5em;
    left: 50%;
    margin-left: -1em;
    width: 2em;
    height: 2em;
    border: 2px solid #009a67;
    border-right-color: transparent;
    border-radius: 50%;
    -webkit-animation: indicator 1s linear infinite;
    animation: indicator 1s linear infinite;
}

@-webkit-keyframes indicator
{
    from { -webkit-transform: rotate(0deg); }
    50%  { -webkit-transform: rotate(180deg); }
    to   { -webkit-transform: rotate(360deg); }
}

@keyframes indicator
{
    from { transform: rotate(0deg); }
    50%  { transform: rotate(180deg); }
    to   { transform: rotate(360deg); }
}

</style>

::style-https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.css::
::style-https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid-theme.min.css::
 
::script-https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js::
::script-https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.js::