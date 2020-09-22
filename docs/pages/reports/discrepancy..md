# Discrepancy Report

Select a work order to print:
<select id="workorder-dropdown"></select>
<div id="pages"></div>
<button id="print-report" type="button">Print</button>


<iframe id="report"></iframe>

<style>
iframe {
  background-color: white;
  width:100%;
  height:600px;
}

</style>


<script>
var reportpath = 'svg/plain_LCA_Discrepancy_Form_Rev_2_pg_1.html';
var woData, pageData;
poc2go.printframe = () => {document.getElementById("iframe").contentWindow.print();}

poc2go.fetch.json(`${poc2go.config.lca.db}/list/workorder`)
.then(data => {
  let options = ['<option value="none">Select work order</option>'];
  for (const item of data) {
    options.push(`<option value="${item._id}">${item.name}</option>`);
  }
  const select = document.getElementById('workorder-dropdown');
  select.innerHTML = options.join('\n');
})

poc2go.pagenbr = (nbr) => {
  getReport(reportpath, nbr)
}

poc2go.dom['print-report'].addEventListener("click", () => {
  poc2go.dom['report'].contentWindow.print();  
}, false);

poc2go.dom['workorder-dropdown'].addEventListener("change", (evt) => {
  if (evt.target.value === 'none') return;
  poc2go.fetch.json(`${poc2go.config.lca.db}/json/workorder/${evt.target.value}`)
  .then((data) => {
    woData = data[0];
    getReport(reportpath);
  })
}, false);

const getDataFields = (page) => {
  page = page || 1;
  let offset = (page-1) * 3;
  let pages = Math.floor(woData.tasks.length/3) + 1;

  if (!pageData) {
    for (let i=0; i<pages; i++) {
      poc2go.dom['pages'].innerHTML = poc2go.dom['pages'].innerHTML +
        `<button onclick="poc2go.pagenbr(${i+1});">Page ${i+1}</button>`;
    }
  }

  
  let company = woData.company[0];
  let aircraft = woData.aircrafts[0];
  let engine = aircraft.engines[0];

  let tnbr = 1, vals = {};
  for (const tsk of woData.tasks) {
    if (tnbr > offset) {
      vals[`task_nbr-${tnbr-offset}`] = tnbr;
      vals[`task_corrected_by-${tnbr-offset}`] = tsk.corrected_by;
      vals[`task_inspected_by-${tnbr-offset}`] = tsk.inspected_by;
      vals[`task_removed_pn-${tnbr-offset}`] = tsk.removed_pn;
      vals[`task_removed_sn-${tnbr-offset}`] = tsk.removed_sn;
      vals[`task_installed_pn-${tnbr-offset}`] = tsk.installed_pn;
      vals[`task_installed_sn-${tnbr-offset}`] = tsk.installed_sn;
      vals[`task_discrepancy_box-${tnbr-offset}`] = tsk.discrepancy;
      vals[`task_corrective_action_box-${tnbr-offset}`] = tsk.corrective_action;
      vals[`task_time-${tnbr-offset}`] = tsk.time;
    }
    tnbr++;
  }

  while (tnbr-offset <= 3) {
    vals[`task_nbr-${tnbr-offset}`] = tnbr;
    vals[`task_corrected_by-${tnbr-offset}`] = '';
    vals[`task_inspected_by-${tnbr-offset}`] = '';
    vals[`task_removed_pn-${tnbr-offset}`] = '';
    vals[`task_removed_sn-${tnbr-offset}`] = '';
    vals[`task_installed_pn-${tnbr-offset}`] = '';
    vals[`task_installed_sn-${tnbr-offset}`] = '';
    vals[`task_discrepancy_box-${tnbr-offset}`] = '';
    vals[`task_corrective_action_box-${tnbr-offset}`] = '';
    vals[`task_time-${tnbr-offset}`] = '';
    tnbr++;
  }

  let hdr = {
    'title_wo_nbr': woData.workorder_no,
    'title_date': new Date().toLocaleDateString('en-us'), // 18/02/2019,
    'title_pg_nbr': page,
    'title_of_nbr': pages,
    'name-1': company.name,
    'address-1': company.address,
    'city-1': company.city,
    'state-1': company.state,
    'zip-1': company.zip,
    'aircraft_name-1': aircraft.name,
    'aircraft_model-1': aircraft.model,
    'aircraft_serial_no-1': aircraft.serial_no,
    'aircraft_registration_no-1': aircraft.registration_no,
    'aircraft_time_in_service-1': aircraft.time_in_service,
  };
  pageData = Object.assign(hdr, vals);
  return pageData;

//  'work_requested_box': woData.work_requested,
//  'work_discrepancy_box': woData.inspection_discrepancies,

};

const getReport = (filepath, page) => {
  const iframe = poc2go.dom['report'];
  iframe.onload = () => {
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    var jdoc = getDataFields(page);
    doc.getElementById('task_discrepancy_box-1').innerHTML = jdoc['task_discrepancy_box-1'];
    doc.getElementById('task_corrective_action_box-1').innerHTML = jdoc['task_corrective_action_box-1'];
    doc.getElementById('task_discrepancy_box-2').innerHTML = jdoc['task_discrepancy_box-2'];
    doc.getElementById('task_corrective_action_box-2').innerHTML = jdoc['task_corrective_action_box-2'];
    doc.getElementById('task_discrepancy_box-3').innerHTML = jdoc['task_discrepancy_box-3'];
    doc.getElementById('task_corrective_action_box-3').innerHTML = jdoc['task_corrective_action_box-3'];
    for (const fld in jdoc) {
      let rptfld = doc.querySelector(`#${fld} tspan`);
      if (rptfld) rptfld.innerHTML = jdoc[fld];
    }
  }
  iframe.src = filepath;  
};

</script>
