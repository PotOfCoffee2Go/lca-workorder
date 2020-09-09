# Log Entries Report

Select a work order to print:
<select id="workorder-dropdown"></select>
<button id="print-report" type="button">Print</button>


<iframe id="report" src="pages/reports/LogEntries.html"></iframe>

----

<script>
poc2go.fetch.json(`${poc2go.config.lca.workorderDb}list/workorder`)
.then(data => {
  let options = [];
  for (const item of data) {
    options.push(`<option value="${item._id}">${item.name}</option>`);
  }
  const select = document.getElementById('workorder-dropdown');
  select.innerHTML = options.join('\n');
})

const getBlobURL = (code, type) => {
  const blob = new Blob([code], { type })
  return URL.createObjectURL(blob)
}
  
poc2go.dom['print-report'].addEventListener("click", () => {
  poc2go.dom['report'].contentWindow.print();  
}, false);

poc2go.dom['workorder-dropdown'].addEventListener("change", (evt) => {
  poc2go.fetch.text('pages/reports/LogEntries.html')
  .then((content) => {
    poc2go.fetch.json(`${poc2go.config.lca.workorderDb}json/workorder/${evt.target.value}`)
    .then((data) => {
      data = data[0];
      let placeholders = content.match(/\{\{.*\}\}/g);
      for (let i=0; i<placeholders.length; ++i) {
	let field = placeholders[i].replace('{{','').replace('}}','');
	if (field.includes('aircraft')) {
	  field = field.replace('aircraft.','');
	  content = content.replace((new RegExp(placeholders[i],'g')), data.aircrafts[0][field]);
	}
	else {
	  content = content.replace((new RegExp(placeholders[i],'g')), data[field]);
	}

      }
      var myIFrame = poc2go.dom['report'];
      myIFrame.contentWindow.document.body.innerHTML = content;
    });
  })
}, false);
</script>

<style>
iframe { height: 600px; width: 100%; border: none; }
</style>

