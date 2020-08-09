// See core/fetch.js for inserts()

// Inline styles
// Extracted, stored, and injected back in rendered stage
class InlineStyles {
  constructor() { this.init();  }

  init() {
    this.styles = [];
  }

  // Store off scripts for processing later - this.run()
  reposit(txt) {
return txt;
    let match;
    let regex = /<style[^>]*>([^]*?)<\/style>/g;
    while ((match = (new RegExp(regex)).exec(txt)) !== null) {
      let placeHolder = 'ddd' + Math.random() + 'vvv';
      this.styles.push({
        regex: new RegExp(placeHolder),
        text: match[1],
      });
      txt = txt.replace(match[0], placeHolder);
    }
    return txt;
  }

  inject(txt) {
    this.styles.forEach(style => {
      txt = txt.replace(style.regex,
        '<style>' + style.text + '</style>');
    });
    return txt;
  }
}

// Inline scripts
// Extracted, stored, and executed during the
//  proper stage of building doc-canvas document
class InlineScripts {
  constructor() { this.init();  }

  init() {
    Object.assign(this, {
      fetched: [],  // Scripts run in fetched stage
      rendered: [], //  in rendered stage
      loaded: []    //  in loadeded stage
    });
  }

  // Store off scripts for processing later - this.run()
  reposit(txt) {
    let match;
    let regex = /<script[^>]*>([^]*?)<\/script>/g;
    while ((match = (new RegExp(regex)).exec(txt)) !== null) {
      let placeHolder = 'aaa' + Math.random() + 'zzz';
      let type = 'loaded'; // default
      if (/type[ ='"]+.*rendered/.test(match[0])) {
        type = 'rendered';
      }
      else if (/type[ ='"]+.*fetched/.test(match[0])) {
        type = 'fetched';
      }
      if (type === 'loaded') {
        placeHolder = '';
      }
      this[type].push({
        regex: new RegExp(placeHolder),
        text: match[1],
      });
      txt = txt.replace(match[0], placeHolder);
    }
    return txt;
  }

  // Execute scripts of type 'fetched', 'rendered', or
  //  'loaded' and inject results
  run(type, txt) {
    this[type].forEach(script => {
      let result = eval('(function(txt) {' + script.text + '}());');
      if (type !== 'loaded') {
        if (result) { txt = txt.replace(script.regex, result); }
        else { txt = txt.replace(script.regex, ''); }
      }
    });
    return txt;
  }
}

// Include ::include doc.md:: files
//  rendered separately by highlight.js as code blocks
// Content is fetch by poc2go.fetch.includes()
class Include {
  constructor() { this.init();  }

  init() { this.blocks = [];  }

  // Process querystring &text=
  text() {
    let text = poc2go.url.params.get(poc2go.params.text);
    if (text) {
      let md = [
        `# ${text}\n\n`,
        `Raw: `, `<a href="${text}">${text}</a>\n\n`,
        `Go_to: `, `<a href="?md=${text}">${text}</a>\n\n`,
        `::include-${text}::\n\n`,
        ].join('');
      return poc2go.fetch.includes(md);
    }
    return null;
  }

  // Highlight and inject included files
  inject(txt) {
    let wrapcode = '';
    this.blocks.forEach(block => {
      if (block.lang === 'txt') { block.lang = 'plaintext' }
      if (block.lang === 'md') {
        block.lang = 'html';
        wrapcode = 'wrapcode';
      }

    // Highlight with highlight.js
    let hilighted = hljs.
      highlight(block.lang, block.text, true).value;
      txt = txt.replace(block.regex,
        `<pre class="${wrapcode}">` +
          `<code class="language-${block.lang}">` +
          hilighted + '</code></pre>');
    });

    return txt;
  }
}
