/* Collect information from the document text and insert
    Mustache.js tags for processing later (render.js)
*/
class DocInfo {
  constructor() { }

  // Locate the first level 1 markdown title in the doc
  //  and Mustache tag it
  locateTitle(txt) {
    if (/^# /m.test(txt)) {
      let title = /^# (.*)$/m.exec(txt);
      this.title = title[1];
      txt = txt.replace(/^# .*$/m, ``);
    }
    else {
      this.title = '(untitled)';
    }
    return txt;
  }

  // Inject the Mustache tags for the anchors and
  //  title - first level 1 header it runs across
  createMustacheTags(txt) {
    let txta = txt.split(/\r\n|\r|\n/);
    for (let i = 0; i < txta.length-1; i++) {
      let line = txta[i].replace(/ *$/,'');
      // Is a markdown header - make an anchor
      if (/^#+/.test(line)) {
        txta[i] = '{{#a}}' + txta[i] + '{{/a}}\n' + txta[i];
      }
      // Store doc info lines - ie: Copyright: MIT
      else if (/^[A-Z][\w\(\)]+:.*/.test(line)) {
        let tagName = line.match(/^[\w\(\)]+/)[0];
        if (this[tagName]) { continue; }
        this[tagName] = line.match(/:.*$/)[0].replace(':', '');
        txta.splice(i, 1); i--; // Remove info line
      }
    }
    return this.locateTitle(txta.join('\n'));
  }
}

/*
Hold data collected about the document.
Contains functions called by Mustache tags.
*/
class Render {
  constructor() { this.init(); }

  init() { Object.assign(this, {
      // Values loaded when fetched by namespace.js
      _docinfo: new DocInfo,
      _layout: null,
      _anchors: [],   // Anchors in document
    });
  }

  // {{filepath}}
  filepath() {
    let filepath = poc2go.url.params.get(poc2go.params.md)
        || poc2go.default.md;

    if (!/\.md$/.test(filepath)) { filepath += '.md'; }
    return filepath;
  }

  // {{title}}
  title() {
    document.title = this._docinfo.title; // In browser tab
    return this._docinfo.title;
  }

  // Layout Nav Bar, Settings form, and Header
  // {{{header}}}
  header() {
    return [
      this._layout.navDiv,
      this._layout.settingsDiv,
      this._layout.headerDiv,
    ].join('\n');
  }

  // {{{footer}}}
  footer() {
    return this._layout.footerDiv;
  }

  // Show localStorage in JSON
  // {{settings}}
  settings() {
    var values = '{}';
    if (localStorage.values) {
      values = JSON.stringify(
        JSON.parse(localStorage.values), null, 2);
    }
    return poc2go.markit('``` json\n' + values + '\n```\n');
  }

  // Id of button will be 'btnButtonText' (the text without spaces)
  //  add that id in listeners.js to perform action of the button
  // {{#button}}Button Text{{{/button}}}
  button() {
    return (val, render) => {
      let valId = 'btn' + val.replace(/ /g, '');
      return `<button id="${valId}" type="button">${val}</button>`;
    };
  }

  // Insert an HTML anchor
  // {{#a}}Anchor Text{{/a}}
  a() {
    return (val, render) => {
      var anctext = val.replace(/#/g,'').trim()
        .replace(/::.*::/g,'') // doc-canvas instructions
        .replace(/ /g,'-').toLowerCase();

      // Store link for navbar and display the text
      this._anchors.push(render(
        '<a class="anlink"' +
        `href="#${this._anchors.length ? anctext : ''}">` +
        val.trim().replace(/^#/,'')
          .replace(/#/g, '─')
          .replace(/::.*::/g,'') +
        `</a><br />`));
      return  `<a name="${anctext}"></a>\n`;
    };
  }

  // Doc-canvas instructions
  // {{#i}}instruction ...{{/i}}
  i() {
    return (val, render) => {
      // Place includes back for processing later
      if (/include-/.test(val)) {
         return '::' + val.replace(/^[^ ]* */,'') + '::';
      }

      // Instructions are processed in order
      //  html first, attributes second, ...
      let rank = { html: 0, attribute: 1 };
      let instructions = [];

      // get HTML tag to be modified - if one
      let match = val.match(/<.*> /);
      let htmlTag = match ? match[0].trim() : '';
      let rendered = htmlTag;
      val = val.replace(rendered, '');
      let haveHtmlInstruction = false;

      // Place instructions in an array
      let instructionNames = val.split(' ');
      for (let i=0; i<instructionNames.length; i++) {
        if (!instructionNames[i]) { continue; }
        let instruction = poc2go.instructions.getInstruction(instructionNames[i]);
        if (instruction) {
          instruction.rank = rank[instruction.type];
          instructions.push(instruction);
        }
      }

      // Order instructions for processing
      instructions.sort((a, b) => (a.rank > b.rank) ? 1 : -1);

      instructions.forEach(instruction => {
        if (instruction.type === 'html') {
          rendered = instruction.value;
          haveHtmlInstruction  = true;
        }
        else if (instruction.type === 'attribute') {
          if (rendered.indexOf(instruction.attr) > -1) {
            rendered = rendered
              .replace(`${instruction.attr}="`,
                `${instruction.attr}="${instruction.value} `);
          }
          else {
            rendered = rendered.replace('>',
            ` ${instruction.attr}="${instruction.value}">`);
          }
        }
      });

      // todo: figure out how to actually handle haveHtml
      return haveHtmlInstruction ? (htmlTag + rendered) : rendered;
    }
  }

  // {{{docinfo}}}
  docinfo() {
    let info = [];
    let tags = Object.keys(this._docinfo);
    tags.forEach(tag => {
      if (/[A-Z]/.test(tag)) {
        info.push('<span>' + tag.replace(/_/g, ' ')  +
        ': ' + this._docinfo[tag] + '; </span>');
      }
    });
    return info.join('');
  }
}
