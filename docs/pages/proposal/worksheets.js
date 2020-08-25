<script>
  var ns = {
    templates: {
      company: '',
      workorder: '',
      associate: '',
    }
  }

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
    let saveFile = poc2go.dom['storeFile'];
    let dataBase64 = btoa(data);
    saveFile.download = evt.target.innerHTML.toLowerCase() + '.csv';
    saveFile.href = `data:application/octet-stream;charset=utf-8;base64,${dataBase64}`;
    saveFile.click();
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
