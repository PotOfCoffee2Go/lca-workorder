#  LCA Database Import/Export

<select id="company-dropdown"></select>
<select id="workorder-dropdown"></select>
<button id="submit-db">Submit to database</button>

<textarea id="tsv-data" class="editBoxes" type="textarea" cols="30" rows="5" wrap="hard"> </textarea>

<button id="btn-copy">Copy</button>

<style>

.editBoxes {
  color: var (--clrText);
  white-space: nowrap;  overflow: auto;
  width: 99%;
  height: 200px;
  min-width: 40%;
  max-width: 99%;
  min-height: 50px;
  resize: vertical;
  -webkit-box-sizing: border-box;
  /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box;
  /* Firefox, other Gecko */
  box-sizing: border-box;
  /* Opera/IE 8+ */
}

button {
  opacity: 1;
}

</style>

<script>
poc2go.dom['btn-copy'].addEventListener("click", (evt) => {
  var copyText = poc2go.dom['tsv-data'];
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  poc2go.dom['btn-copy'].innerHTML = 'Copied!';
  setTimeout(()=> {
    poc2go.dom['btn-copy'].innerHTML = 'Copy';
    copyText.setSelectionRange(0,0);
  }, 1000);
})

poc2go.dom['tsv-data'].addEventListener("paste", (evt) => {
  var copyText = poc2go.dom['tsv-data'];
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
}, true);

poc2go.dom['company-dropdown'].addEventListener("change", (evt) => {
  changeCompany(evt.target.value);
}, false);

poc2go.dom['workorder-dropdown'].addEventListener("change", (evt) => {
  changeWorkorder(evt.target.value);
}, false);


poc2go.dom['submit-db'].addEventListener('click', (event) => {
let value = poc2go.dom['tsv-data'].value;
  postText(`${poc2go.config.lca.workorderDb}sheet/update`, value)
  .then(txt => poc2go.dom['tsv-data'].value = txt)
}, false);

  async function postText(url, data = '') {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'text/plain'
        // 'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: data // body data type must match "Content-Type" header
    });
    return response.text();//.json(); // parses JSON response into native JavaScript objects
  }

// --------


const listAllCompanies = () => {
poc2go.fetch.json(`${poc2go.config.lca.workorderDb}list/company`)
.then(data => {
  let options = [`<option value="workorders">(select company or workorder)</option>`];
  for (const item of data) {
    options.push(`<option value="${item._id}">${item.name}</option>`);
  }
  poc2go.dom['company-dropdown'].innerHTML = options.join('\n');
})
}

const listAllAircraft = () => {
poc2go.fetch.json(`${poc2go.config.lca.workorderDb}list/aircraft`)
  .then(data => {
  let options = [`<option value="none">(Not selected)</option>`];
  for (const item of data) {
    options.push(`<option value="${item._id}">${item.name}</option>`);
  }
  poc2go.dom['aircraft-dropdown'].innerHTML = options.join('\n');
})
}

const listAllWorkorders = () => {
poc2go.fetch.json(`${poc2go.config.lca.workorderDb}list/workorder`)
  .then(data => {
  let options = [`<option value="companies">(company)</option>`];
  for (const item of data) {
    options.push(`<option value="${item._id}">${item.name}</option>`);
  }
  poc2go.dom['workorder-dropdown'].innerHTML = options.join('\n');
})
}

const changeCompany = (value) => {
  if (value === 'workorders') return listAllWorkorders();
  poc2go.fetch.text(`${poc2go.config.lca.workorderDb}sheet/company/${value}`)
  .then((content) => {
  console.log('company value', value);
    poc2go.dom['tsv-data'].value = content;
    let options = [`<option value="companies">(company)</option>`];
    let lines = content.split('\n');
    for (const line of lines) {
      let fields = line.split('\t');
      if (fields[2] === 'workorder') {
      options.push(`<option value="${fields[1]}">${fields[3]}</option>`);
	  }
	}
	poc2go.dom['workorder-dropdown'].innerHTML = options.join('\n');
  })
}

const changeWorkorder = (value) => {
  if (value === 'companies') {
    changeCompany(poc2go.dom['company-dropdown'].value);
    return;	
  }
  poc2go.fetch.text(`${poc2go.config.lca.workorderDb}sheet/workorder/${value}`)
  .then((content) => {
    poc2go.dom['tsv-data'].value = content;
  })
}

listAllCompanies();
//listAllAircraft();
listAllWorkorders();

</script>

