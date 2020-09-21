<script>
  var ns = {
    dom: poc2go.dom,
    schema: {},
    templates: {
      company: '',
      workorder: '',
      associate: '',
    },
    form: {
      types: ['company','contact','aircraft','engine','workorder','task','associate'],
    },
    list: {
      workorder: [],
      company: [],
      aircraft: [],
      task: [],
      associate: [],
      contact: [],
    },
  }
  
  poc2go.ns = ns;

  poc2go.fetch.text('worksheets/company.csv')
  .then (data => {ns.templates.company = data;});
  poc2go.fetch.text('worksheets/workorder.csv')
  .then (data => {ns.templates.workorder = data;});
  poc2go.fetch.text('worksheets/associate.csv')
  .then (data => {ns.templates.associate = data;});

  const buttons = document.querySelectorAll('.btnTemplateSheet')
  for (const button of buttons) {
    button.addEventListener('click', function(evt) {
      saveWorksheetOnclick(evt, ns.templates[evt.target.innerHTML.toLowerCase()]);
    })
  }

  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList[0]);
    readText(fileList[0]);
  });
  
  const dropArea = document.getElementById('drop-area');

  dropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Style the drag-and-drop as a "copy file" operation.
    event.dataTransfer.dropEffect = 'copy';
  });

  dropArea.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    console.log(fileList[0]);
    readText(fileList[0]);
    });

  function readText(file) {
    // Check if the file is an image.
//    if (file.type && file.type.indexOf('image') === -1) {
//      console.log('File is not an image.', file.type, file);
//      return;
//    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      let src = event.target.result;
      console.log(src);
    });
    reader.readAsText(file);
  }

  function saveWorksheetOnclick(evt, data) {
    let saveFile = ns.dom['storeFile'];
    let dataBase64 = btoa(data);
    saveFile.download = evt.target.innerHTML.toLowerCase() + '.csv';
    saveFile.href = `data:application/octet-stream;charset=utf-8;base64,${dataBase64}`;
    saveFile.click();
  }

  function populateDropdowns() {
    const selects = document.querySelectorAll('select');
    for (const select of selects) {
      let selpress = /(.*)-(.*)/.exec(select.name);
//      if (selpress) console.log(selpress);
      if (selpress && selpress.length === 3 && selpress[2].match(/.*_id/)) {
        let type = selpress[1], field = selpress[2].match(/(.*)_(.*)/);
        if (ns.list[field[1]] && ns.list[field[1]].options) {
          select.innerHTML = ns.list[field[1]].options.join('\n');
        }
//        console.log(type, field, selpress);
      }
    }
  }

  function listQuery(type, projection) {
    let apireq = {
      api_action: 'list',
      api_type: type,
      find: { _type: type },
      projection: projection ? projection : { _id : 1, name: 1 },
    }

    postData(poc2go.config.lca.db, apireq)
    .then(data => {
      ns.list[type] = {};
      ns.list[type].recs = data;
      ns.list[type].options = [];
      ns.list[type].recs.forEach(item => {
        ns.list[type].options.push(`<option value="${item._id}">${item.name}</option>`);
      })
      populateDropdowns();
    })
  }

  ns.form.types.forEach(type => listQuery(type, { _id: 1, name : 1} ));

  async function postData(url, data = {}) {
    // Default options are marked with *
    const response = await fetch(url + data.api_action, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }



  let lines = [
  'Company,Name,Address,City,State,Zip,Phone,Email,Notes','hi,kim,,,,,,,'
  ];
  let company = [lines[0], lines[1]].join('\n');

  csv().fromString(company)
    .subscribe((jsonObj)=>{
      console.log(jsonObj);//jsonObj: {column2:"1234"}

let csv = json2csv.parse(jsonObj);
    console.log(csv);
    })

</script>
