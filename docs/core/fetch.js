// Fetches resorces from network
class Fetch {
  constructor () { this.init() }
  init() {}

  // Check fetch() http status
  //  when valid return response text
  textResponse(res) {
    return res.ok
    ? Promise.resolve(res.text())
    : Promise.reject(`HTTP error: (${res.status}) - ${res.statusText}\n${res.url}`);
  }

  // Check fetch() http status
  //  when valid return response JSON
  jsonResponse(res) {
    return res.ok
    ? Promise.resolve(res.json())
    : Promise.reject(`HTTP error: (${res.status}) - ${res.statusText}\n${res.url}`);
  }

  // Fetch the URI path and return the content as text
  text(filepath) {
    return fetch(filepath)
      .then(res => this.textResponse(res));
  }

  // Fetch the URI path and return the content as JSON
  json(filepath) {
    return fetch(filepath)
      .then(res => this.jsonResponse(res));
  }

  // Load the doc-canvas instructions css/html/attr
  // Important! must be in that order in Promise.all!
  instructions() {
    return Promise.all([
      this.text(poc2go.config.instructions.css),
      this.text(poc2go.config.instructions.html),
      this.text(poc2go.config.instructions.attr)
    ])
    .then(inst => {
      inst[0] = '{{=<% %>=}}\n<%#style%> {"type":"reserved"}\n' +
        inst[0] + '\n<%/style%>\n<%={{ }}=%>\n';
      inst[1] = '{{=<% %>=}}\n<%#html%> {"type":"reserved"}\n' +
        inst[1] + '\n<%/html%>\n<%={{ }}=%>\n';
      return inst; })
    .then(inst => inst.join('\n'))
    .then(inst => {poc2go.instructions = new Instructions(inst);});
  }

  // Load the code highlight styles
  hljscss() {
    return poc2go.hljscss
      .get(poc2go.store.db.highlight.name);
  }

  // Load the layout html
  layout() {
    return this.text(poc2go.config.design.layout.html)
    .then(htm => {poc2go.render._layout = new Layout(htm);});
  }

  // Get document and the includes,inserts,scripts in content
  content() {
    // querystring text=
    let textRequest = poc2go.include.text();
    if (textRequest) { return textRequest; }

    // querystring md=
    return this.text(poc2go.render.filepath())
      .then(txt => this.inserts(txt))
      .then(txt => this.renderCodeBlocks(txt))
      .then(txt => this.styles(txt))
      .then(txt => this.scripts(txt))
      .then(txt => this.includes(txt));
  }

  // Locate and render codeblocks ```...```
  renderCodeBlocks(txt) {
    let match;
    let codeBlocks = [];

//    txt = txt.replace(/\`::/g,'\`&#58;&#58;')
//      .replace(/::\`/g,'&#58;&#58;\`');

    // Render the code blocks
    let regex = new RegExp(/```([^]*?)```/,'g');
    while ((match = regex.exec(txt)) !== null) {
        codeBlocks.push(match[0]);
    }
    codeBlocks.forEach(codeblock => {
      let marked = codeblock.replace(codeblock, poc2go.markit(codeblock));
      marked = marked.replace(/::/g,'&#58;&#58;');
      txt = txt.replace(codeblock, marked);
    });
    return txt;
  }

  // Given regex to search txt and capture URL
  //  then extract all occurances and fetch URL data
  //  see inserts(), includes(), scripts() below
  gatherUrlContents(txt, exp) {
    return new Promise((resolve, reject) => {
      let uri, matches = [], fetches = [];
      let regex = new RegExp(exp);
      while ((uri = regex.exec(txt)) !== null) {
        matches.push(uri[0]);
        fetches.push(this.text(uri[1]));
      }
      Promise.all(fetches)
      .then(fetched => {
        resolve({matches:matches, fetched:fetched});
      })
    })
  }

  // Fetch and ::insert doc.md:: files into document
  //  will be rendered as if typed into the document
  inserts(txt) {
    return new Promise((resolve, reject) => {
      this.gatherUrlContents(txt, /::insert-(.+)::/g)
      .then(rslt => {
        rslt.fetched.forEach((text, idx) => {
          txt = txt.replace(rslt.matches[idx], text);
        });
        resolve(txt);
      })
      .catch(err => resolve(txt)) // Just return the doc
    });
  }

  styles(txt) {
    return new Promise((resolve, reject) => {
      this.gatherUrlContents(txt, /::style-(.+)::/g)
      .then(rslt => {
        rslt.fetched.forEach((text, idx) => {
          txt = txt.replace(rslt.matches[idx], '');
          let style =  document.createElement('style');
          style.innerHTML = text;
          document.head.appendChild(style);
        });
        resolve(txt);
      })
      .catch(err => resolve(txt)) // Just return the doc
    });
  }

  scripts(txt) {
    return new Promise((resolve, reject) => {
      this.gatherUrlContents(txt, /::script-(.+)::/g)
      .then(rslt => {
        rslt.fetched.forEach((text, idx) => {
          txt = txt.replace(rslt.matches[idx], '');
          let script =  document.createElement('script');
          script.innerHTML = text;
          document.head.appendChild(script);
        });
        resolve(txt);
      })
      .catch(err => resolve(txt)) // Just return the doc
    });
  }

  // Include a URL - display code block of URL
  //  includes are squirreled away until end
  //  of processing then placed into document
  includes(txt) {
    return new Promise((resolve, reject) => {
      this.gatherUrlContents(txt, /::include-(.+)::/g)
      .then(rslt => {
        rslt.fetched.forEach((text, idx) => {
          let placeHolder = 'bbb' + Math.random() + 'zzz';
          txt = txt.replace(rslt.matches[idx], placeHolder);
          poc2go.include.blocks.push({
            regex: placeHolder,
            text: text,
            lang: rslt.matches[idx].match(/\.(\w+)::/)[1],
          });
        });
        resolve(txt);
      })
      .catch(err => resolve(txt)) // Just return the doc
   });
  }
}
