<script>
    var ns = {
    dom: poc2go.dom,
    schema: {},
    form: {
      index: {
        workorder: 0,
        company: 0,
        aircraft: 0,
        task: 0,
        associate: 0,
        contact: 0,
      },
      workorder: [],
      company: [],
      aircraft: [],
      task: [],
      associate: [],
      contact: [],
    },
    list: {
      workorder: [],
      company: [],
      aircraft: [],
      task: [],
      associate: [],
      contact: [],
    },
    editors: {
      workorder: null,
      company: null,
      aircraft: null,
      engine: null,
      task: null,
      associate: null,
      contact: null,
    },
    current: {
      index: {
        workorder: 0,
        company: 0,
        aircraft: 0,
        task: 0,
        associate: 0,
        contact: 0,
      },
      workorder: [],
      company: [],
      aircraft: [],
      task: [],
      associate: [],
      contact: [],
    },
  }


  let editors = Object.keys(ns.editors);
  for (let editor of editors) {
    ns.editors[editor] = CodeMirror(poc2go.dom[`staged-${editor}`],{
      lineWrapping: true,
      lineNumbers: true,
      theme: poc2go.store.db.codemirror.name,
      viewportMargin: Infinity
    });
  }

  ns.dom['show-records'].addEventListener("click", () => {
    var allDbSchema = document.querySelectorAll('.schema');
    for (var i=0, len=allDbSchema.length|0; i<len; i=i+1|0) {
      if (allDbSchema[i].style.display === 'block') {
        allDbSchema[i].style.display = 'none';
        ns.dom['show-records'].value = "Show DB Records"
      } else {
        allDbSchema[i].style.display = 'block';
        ns.dom['show-records'].value = "Hide DB Records"
      }
    }
  }, false);
  
  ns.dom['chk-admin'].addEventListener("click", () => {
    var allAdminBtns = document.querySelectorAll('.admin-btns');
    for (var i=0, len=allAdminBtns.length|0; i<len; i=i+1|0) {
      if (allAdminBtns[i].style.display === 'block') {
        allAdminBtns[i].style.display = 'none';
        ns.dom['chk-admin'].checked = false;
      } else {
        allAdminBtns[i].style.display = 'block';
        ns.dom['chk-admin'].checked = true;
      }
    }
  }, false);
  const buttons = document.querySelectorAll('div button')
  for (const button of buttons) {
    button.addEventListener('click', function(evt) {
      // alert(evt.target.id);
      let btnpress = /(.*)-(.*)-(.*)/.exec(evt.target.id);
      if (!btnpress || btnpress.length !== 4 || btnpress[1] !== 'btn') { return; }
      formBtn(btnpress[2], btnpress[3]);
    })
  }
  
  const labels = document.querySelectorAll('div label')
  for (const label of labels) {
    label.addEventListener('click', function(evt) {
      console.log(evt.target.getAttribute('for'));
      let lblpress = evt.target.getAttribute('for');
      let input = document.querySelector(`input[name=${lblpress}]`);
      if (input) {
        if (input.value) {
          input.value = '';
        }
        else {
          let type = lblpress.replace(/-.*$/, '');
          let field = lblpress.replace(type + '-', '');
          let val = ns.form[type][ns.form.index[type]][field];
          if (val) {
            input.value = val;
          }
        }
      }
    })
  }  


  function formBtn(type, btn) {
    if (['contact','engine','aircraft','company','associate','task','workorder'].indexOf(btn) > -1) {
      let hash = btn + 's';
      if (btn === 'company') { hash = 'company' }
      location.hash = "#" + hash;
      return;
    }
  
    let apireq = { api_action: btn, api_type: type }
    
    if (btn === 'prev') {
      displayForm(type, --ns.form.index[type]);
      return;
    }
    else if (btn === 'next') {
      displayForm(type, ++ns.form.index[type]);
      return;
    }
    else if (btn === 'find') {
      apireq.find = {_type: type};
    }
    else if (btn === 'add') {
      apireq.add = {};
      console.log(ns.schema)
      let dbfields = Object.keys(ns.schema[type]);
      for (const dbfield of dbfields) {
        if (dbfield[0] === '_') {
          apireq.add[dbfield] = ns.schema[type][dbfield];
        }
      }
      delete apireq.add._id;
    }
    else if (btn === 'update') {
      apireq.find = { _id: ns.form[type][ns.form.index[type]]._id }
      apireq.update = {};
    }
    
    let form = ns.dom[type + '-form'];
    const inputs = form.querySelectorAll('input');
    for (const input of inputs) {
      if (btn === 'clear') {
        input.value = "";
      }
      else if (btn === 'find' && input.value) {
        console.log('type', type);
        apireq.find[input.name.replace(`${type}-`,'')] = input.value;
      }
      else if (btn === 'add') {
        apireq.add[input.name.replace(`${type}-`,'')] = input.value;
      }
      else if (btn === 'update') {
        apireq.update[input.name.replace(`${type}-`,'')] = input.value;
      }
      else if (btn === 'delete') {
        console.log(btn, input.name);
      }
    }
    
    if (['find','add','update', 'delete'].indexOf(btn) > -1) {
      apiRequest(apireq);
      window.animatelo['flash'](`#schema-${type}`);
    }
  }


  function displayForm(type, idx = 0) {
    let nbrRecs = ns.form[type].length;
    ns.form.index[type] = idx<0 ? 0 : (idx>=nbrRecs ? nbrRecs-1 : idx);
    idx = ns.form.index[type];
    ns.dom[`schema-${type}`].innerHTML = 
      hljs.highlight('json', JSON.stringify(ns.form[type][idx], null, 2)).value;

    let form = ns.dom[type + '-form'];
    const inputs = form.querySelectorAll('input');
    for (const input of inputs) {
      let val = ns.form[type][idx][input.name.replace(`${type}-`,'')];
      input.value = val ? val.toString() : "";
    }

    if (idx > 0) {
      ns.dom[`btn-${type}-prev`].classList.add('btn-enabled');
    }
    else {
      ns.dom[`btn-${type}-prev`].classList.remove('btn-enabled');
    }
    if (idx < nbrRecs-1) {
      ns.dom[`btn-${type}-next`].classList.add('btn-enabled');
    }
    else {
      ns.dom[`btn-${type}-next`].classList.remove('btn-enabled');
    }
  }

  function apiRequest(apireq) {
    postData(poc2go.config.lca.workorderDb, apireq)
    .then(data => {
      let msg = ns.dom[`msg-${apireq.api_type}`];
      if (!Array.isArray(data)) {
        msg.innerHTML = JSON.stringify(data);
        return;
      }
      ns.form[apireq.api_type] = data;
      let nbrRecs = ns.form[apireq.api_type].length;
      if ( nbrRecs === 0) {
          msg.innerHTML = `${apireq.api_action}: no records found`;
      }
      else {
        msg.innerHTML = `${apireq.api_action}: successful - ${ns.form[apireq.api_type].length} record${nbrRecs === 1 ? '' : 's'}`;
      }
      displayForm(apireq.api_type, 0);
      console.log('resp', data);
    });
  }

  function listQuery(type, projection) {
    let apireq = {
      api_action: 'list',
      api_type: type,
      find: { _type: type },
      projection: projection ? projection : { _id : 1 },
    }

    postData(poc2go.config.lca.workorderDb, apireq)
    .then(data => {
      ns.list[type] = data;
    });
  }

  listQuery('company', { _id: 1, name : 1} );

   poc2go.fetch.json('server/rest/api/models/workorderModel.json')
   .then(json => {
		ns.schema = json.schema;
/*
     document.getElementById('schema-associate').innerHTML = 
      hljs.highlight('json', JSON.stringify(ns.schema.associate, null, 2)).value;
     document.getElementById('schema-contact').innerHTML = 
      hljs.highlight('json', JSON.stringify(ns.schema.contact, null, 2)).value;
     document.getElementById('schema-company').innerHTML = 
      hljs.highlight('json', JSON.stringify(ns.schema.company, null, 2)).value;
     document.getElementById('schema-engine').innerHTML = 
      hljs.highlight('json', JSON.stringify(ns.schema.engine, null, 2)).value;
     document.getElementById('schema-aircraft').innerHTML = 
      hljs.highlight('json', JSON.stringify(ns.schema.aircraft, null, 2)).value;
     document.getElementById('schema-task').innerHTML = 
      hljs.highlight('json', JSON.stringify(ns.schema.task, null, 2)).value;
     document.getElementById('schema-workorder').innerHTML = 
      hljs.highlight('json', JSON.stringify(ns.schema.workorder, null, 2)).value;
*/
   });


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

 // CodeMirror style selector dropdown box
  const cmStylesheet = new CodeMirrorCss;
  ns.dom.cmCssSelector.value = poc2go.store.db.codemirror.name;
  cmStylesheet.get(ns.dom.cmCssSelector.value);

  ns.dom.cmCssSelector.addEventListener("input", () => {
    cmStylesheet.get(ns.dom.cmCssSelector.value)
    .then(() => {
			let editors = Object.keys(ns.editors);
			for (let editor of editors) {
				ns.editors[editor].setOption("theme", ns.dom.cmCssSelector.value);
			}
		})
  }, false);
  
</script>
