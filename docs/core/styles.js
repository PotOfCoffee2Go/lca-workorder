class Styles {
  constructor() { this.init();  }

  init() {
    Object.assign(this, {
      store: new Store,
      sheet1: document.createElement('style'),
      sheet2: document.createElement('style'),
      setTocStyle: (toc, style) => {
        let curStyle = [
          `.navBar {display: ${style === 'block' ? 'none' : 'inline'};}`,
        ]
        toc.style.display = style;
        this.sheet1.innerHTML = curStyle.join('');
      },
      set: () => {
        let toc = document.getElementById('toc');
        let values = this.store.db;
        values.opts = values.opts || {'tocstyle': 'none'};
        // Load the styles stylesheet
        this.setTocStyle(toc, values.opts.tocstyle);
      },
      setInstructions: (styles) => {
        this.sheet2.innerHTML = styles;
      },
    });
    document.head.appendChild(this.sheet1);
    document.head.appendChild(this.sheet2);
  }
}

// Sets css color varables
class Theme {
  constructor() { this.init();  }

  init() {
    this.store = new Store;

    // Verify localStorage has colors stored
    //   else reset localStorage
    let values = this.store.db;
    values.theme = values.theme || this.store.clear();

    // Set the css vars
    this.set();
  }

  set(colors) {
    colors = colors || this.store.db.theme;
    let cssvars = Object.keys(colors);
    cssvars.forEach(cssvar => {
      document.documentElement.style // :root
      .setProperty('--' + cssvar, colors[cssvar]);
    });
  }
}

// Adds stylesheet to DOM to hold dependency styles
class DependencyCss {
  constructor(projectName, ext) { this.init(projectName, ext); }

  init(projectName, ext) {
   this.projectName = projectName;
   this.ext = ext;
   this.sheet = document.createElement('style');
   document.head.appendChild(this.sheet);
  }

  // Get the styles from CDN
  get(sheetName) {
    return poc2go.fetch.text(
      poc2go.config.design[this.projectName].css +
         sheetName + this.ext
      )
      .then(css => {
        this.sheet.innerHTML = css;
        let dbentry = JSON.parse(
          `{ "${this.projectName}": { "name": "${sheetName}" }}`
        );
        poc2go.store.update = dbentry;
    });
  }
}

// CodeMirror dynamic styles
class CodeMirrorCss extends DependencyCss {
  constructor() { super('codemirror', '.css'); }
}

// Highlight.js dynamic styles
class HljsCss extends DependencyCss {
  constructor() { super('highlight', '.min.css'); }

  // Set code blocks to use highlight.js background
  styleCodeBlocks(codeBlockSelector) {
    var hl = document.body.getElementsByTagName('pre');
    for (let element of hl) {
      element.classList.add('hljs');
      element.classList.add('codeblock');
    }

    codeBlockSelector = 'pre code.language-html,pre code.language-md';
    // Markup doc-canvas for all non-empty code blocks
    //  An empty block usually means still waiting on fetch
    //  so being skipped.
    if (codeBlockSelector) {
      document.body.querySelectorAll(codeBlockSelector)
      .forEach(pre => {
        if (/^\s+$/.test(pre)) { return; }
        pre.innerHTML =
          poc2go.hljscss.customHighlight(pre.innerHTML);
      });
    }

    // Remove dead wood from DOM
    let comments = document.getElementsByClassName('comment');
    while(comments[0]) {
      comments[0].parentNode.removeChild(comments[0]);
    }
    let paras = document.body.querySelectorAll('p');
    paras.forEach(para => {
      if (/\s+$/.test(para.innerHTML)) {
        para.innerHTML = para.innerHTML.replace(/\s+$/,'');
      }
      if (/^\s*$/.test(para.innerHTML)) {
        para.parentNode.removeChild(para);
      }
    });
  }

  // Highlight doc-canvas markup
  customHighlight(preCodeHtml) {
    let hilited = preCodeHtml.split('\n');
    let skip = [], match;
    hilited.forEach((line, idx) => {
      // Skip over scripts and styles
      let begStyle = /&lt;<span.*>style<\/span/;
      let endStyle = /&lt;\/<span.*>style<\/span/;
      let begScript = /&lt;<span.*>script<\/span/;
      let endScript = /&lt;\/<span.*>script<\/span/;
      if (begStyle.test(line) || begScript.test(line)) {
        skip.push('handles nested');
        return;
      }
      if (skip.length) {
        if (endStyle.test(line) || endScript.test(line)) {
          skip.pop();
        }
        return;
      }

      if ((match = line.match(/::[^:]*::/g)) !== null) {
        match.forEach(inst => {
          let hilight;
          if (poc2go.instructions.hasHtml(inst)) {
            hilight = inst.replace(/::([^:]*)::/,
              '<span class="hljs-title">::</span>' +
              '<span class="hljs-keyword">$1</span>' +
              '<span class="hljs-title">::</span>');
          }
          else {
            hilight = inst.replace(/::([^:]*)::/,
              '<span class="hljs-keyword">::</span>' +
              '<span class="hljs-title">$1</span>' +
              '<span class="hljs-keyword">::</span>');
          }
          line = line.replace(inst, hilight);
        });
      }

      line = line.replace(/\{\{([^}]*)\}\}/g,
        '<span class="hljs-keyword">{{</span>' +
        '<span class="hljs-title">$1</span>' +
        '<span class="hljs-keyword">}}</span>');

      line = line.replace(/([^_])_([^_]+)_/g,
        '$1_<em>$2</em>_');

      line = line.replace(/([^*])\*([^*]+)\*/g,
        '$1*<em>$2</em>*');

      line = line.replace(/[_]{2}([^_]+)[_]{2}/g,
        '__<strong>$1</strong>__');

      line = line.replace(/[*]{2}([^*]+)[*]{2}/g,
        '**<strong>$1</strong>**');

      line = line.replace(/^([\s]{4,}.*)$/g,
        '<span class="hljs-comment">$1</span>');

      // Remove any already hilighted in links
      line = line.replace(/\[([^\]]*)]/g,(match, cap1) => {
        return '[<span class="hljs-string">' +
          cap1 + // .replace(/<[^>]+>/g, '') +
          '</span>]'});

      // Remove any already hilighted in links
      line = line.replace(/]\(([^)]*)\)/g,(match, cap1) => {
        return '](<span class="hljs-link">' +
          cap1.replace(/<[^>]+>/g, '') +
          '</span>)'});

      if (/^#+ +/.test(line)) {
        line = '<span class="hljs-selector-class">' +
          line + '</span>';
      }

      hilited[idx] = line;
    });

    return hilited.join('\n');
  }
}
