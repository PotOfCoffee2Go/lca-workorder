# Work Order Form

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
    getReport('svg/plain_LCA_WO_Form_rev_2.html')
  })
}, false);

const getDataFields = () => {
  let company = woData.company[0];
  let aircraft = woData.aircrafts[0];
  let engine = aircraft.engines[0];
  return {
  'workorder_no': woData.workorder_no,
  'start_date': woData.start_date,
  'preliminary_inspection': woData.preliminary_inspection,
  'hidden_damage_inspection': woData.hidden_damage_inspection,
  'in_progress_inspection': woData.in_progress_inspection,
  'aircraft-name': aircraft.name,
  'aircraft-serial_no': aircraft.serial_no,
  'aircraft-make_model': aircraft.make + '/' + aircraft.model,
  'engine-make_model': engine.make + '/' + engine.model,
  'engine-serial_no': engine.serial_no,
  'engine-time_total_overhaul': engine.time_in_service + '/' + engine.time_since_overhaul,
  'company-name': company.name,
  'company-phone': company.phone,
  'company-email': company.email,
  'company-address': company.address,
  'company-city_state': company.city + ', ' + company.state,
  'company-zip': company.zip,
  'completed_date': woData.completed_date,
//  'work_requested_box': woData.work_requested,
//  'work_discrepancy_box': woData.inspection_discrepancies,
  'aircraft-total_time': aircraft.time_in_service
  }

};

const getReport = (filepath) => {
  const iframe = poc2go.dom['report'];
  iframe.onload = () => {
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.getElementById('work_requested_box').innerHTML = woData.work_requested;
    doc.getElementById('work_discrepancy_box').innerHTML = woData.inspection_discrepancies;
    var jdoc = getDataFields();
    for (const fld in jdoc) {
      let rptfld = doc.querySelector(`#${fld} tspan`);
      if (rptfld) rptfld.innerHTML = jdoc[fld];
    }
  };
  iframe.src = filepath;  
};

</script>
