# Discrepancy Report

Select a work order to print:
<select id="workorder-dropdown"></select>
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

poc2go.dom['print-report'].addEventListener("click", () => {
  poc2go.dom['report'].contentWindow.print();  
}, false);

var woData;

poc2go.dom['workorder-dropdown'].addEventListener("change", (evt) => {
  if (evt.target.value === 'none') return;
  poc2go.fetch.json(`${poc2go.config.lca.db}/json/workorder/${evt.target.value}`)
  .then((data) => {
    woData = data[0];
    getReport('svg/plain_LCA_Discrepancy_Form_Rev_2_pg_1.html')
  })
}, false);

const getBlobUrl = (code, type) => {
  const blob = new Blob([code], { type })
  return URL.createObjectURL(blob)
}

const getDataFields = () => {
  let company = woData.company[0];
  let aircraft = woData.aircrafts[0];
  let engine = aircraft.engines[0];

  let tnbr = 1, vals = {};
  for (const tsk of woData.tasks) {
    vals[`task_nbr-${tnbr}`] = tnbr;
    vals[`task_corrected_by-${tnbr}`] = tsk.corrected_by;
    vals[`task_inspected_by-${tnbr}`] = tsk.inspected_by;
    vals[`task_removed_pn-${tnbr}`] = tsk.removed_pn;
    vals[`task_removed_sn-${tnbr}`] = tsk.removed_sn;
    vals[`task_installed_pn-${tnbr}`] = tsk.installed_pn;
    vals[`task_installed_sn-${tnbr}`] = tsk.installed_sn;
    vals[`task_discrepancy_box-${tnbr}`] = tsk.discrepancy;
    vals[`task_corrective_action_box-${tnbr}`] = tsk.corrective_action;
    vals[`task_time-${tnbr}`] = tsk.time;
    tnbr++;
  }

  return Object.assign({
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
  }, vals)

//  'work_requested_box': woData.work_requested,
//  'work_discrepancy_box': woData.inspection_discrepancies,

};

const getReport = async (filepath) => {
  let report = await poc2go.fetch.text(filepath);
  let blobUrl = getBlobUrl(report, 'text/html');
  const iframe = poc2go.dom['report'];
  iframe.onload = () => {
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    var jdoc = getDataFields();
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
  };
  iframe.src = blobUrl;  
};

</script>
