# Log Entries Report

Select a work order to print:
<select id="workorder-dropdown"></select>
<button id="print-report" type="button">Print</button>


<iframe id="report" src="pages/reports/LogEntries.html"></iframe>

----

<script>
poc2go.dom['print-report'].addEventListener("click", () => {
  poc2go.dom['report'].contentWindow.print();  
}, false);

poc2go.fetch.json(`${poc2go.config.lca.db}/list/workorder`)
.then(data => {
  let options = ['<option value="none">Select work order</option>'];
  for (const item of data) {
    options.push(`<option value="${item._id}">${item.name}</option>`);
  }
  const select = document.getElementById('workorder-dropdown');
  select.innerHTML = options.join('\n');
})


var woData, sch = [], unsch = [];

poc2go.dom['workorder-dropdown'].addEventListener("change", (evt) => {
  if (evt.target.value === 'none') return;
  poc2go.fetch.json(`${poc2go.config.lca.db}/json/workorder/${evt.target.value}`)
  .then((data) => {
    woData = data[0];
    getReport('pages/reports/LogEntries.html')
  })
}, false);

const getDataFields = () => {
  let company = woData.company[0];
  let aircraft = woData.aircrafts[0];
  let engine = aircraft.engines[0];

  let tnbr = 1;
  for (const tsk of woData.tasks) { /*
    vals[`task_nbr-${tnbr}`] = tnbr;
    vals[`task_corrected_by-${tnbr}`] = tsk.corrected_by;
    vals[`task_inspected_by-${tnbr}`] = tsk.inspected_by;
    vals[`task_removed_pn-${tnbr}`] = tsk.removed_pn;
    vals[`task_removed_sn-${tnbr}`] = tsk.removed_sn;
    vals[`task_installed_pn-${tnbr}`] = tsk.installed_pn;
    vals[`task_installed_sn-${tnbr}`] = tsk.installed_sn;
    vals[`task_discrepancy_box-${tnbr}`] = tsk.discrepancy; */
    if (tsk.unscheduled === 'yes') {
      unsch.push(tsk.corrective_action);
    }  
    else {
      sch.push(tsk.corrective_action);
    }
    tnbr++;
  }
console.log('kkkll', woData.tasks);
  return {
    'start_date': woData.start_date,
    'workorder_no': woData.workorder_no,
    'aircraft_registration_no': aircraft.registration_no,
    'aircraft_model': aircraft.model,
    'aircraft_serial_no': aircraft.serial_no,
    'aircraft_time_in_service': aircraft.time_in_service,
  }
};

const getReport = (filepath) => {
  const iframe = poc2go.dom['report'];
  iframe.onload = () => {
    var jdoc = getDataFields();
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    let sched = doc.getElementById('sched_list');
    let unsched = doc.getElementById('unsched_list');

    for (const s of sch) {
      sched.innerHTML = sched.innerHTML + `<li class="c14 c23 c22"><span class="c19">${s}</span></li>`;
    }
    for (const u of unsch) {
      unsched.innerHTML = unsched.innerHTML + `<li class="c17"><span class="c19">${u}</span></li>`;
    }
    console.log('sch',sch,'unsch',unsch);
    for (const fld in jdoc) {
      let rptfld = doc.querySelector(`#${fld}`);
      if (rptfld) rptfld.innerHTML = jdoc[fld];
    }
  }
  iframe.src = filepath;  
};


</script>

<style>
iframe { height: 600px; width: 100%; border: none; }
</style>

