// Super class that scans text for Mustache tags
//  and assigns the tag values to this object
// Expects tag delimiters open: '<%' close: '%>'
class TagMemDb {
  constructor(txt) { this.init(txt); }

  init(txt) {
    // Temporary Mustache lambda functions to assign
    //  tag value to 'this'
    this._assignValueFn = { };

    // Get names of all tags
    let regex = /<%#(.*)%>/g;
    let tagNames = [];
    txt.match(regex).forEach(match => {
      tagNames.push(match.replace('<%#','').replace('%>',''));
    });

    // Lambda function stores tag values to this object
    tagNames.forEach(name => {
      if (!this[name]) { // Not already defined
        this._assignValueFn[name] = () => {
          return (val, render) => {
            this[name] = val;
            return '';
          };
        };
      }
    });

    // Get the values then remove temporary lamda functions
    Mustache.render(txt, this._assignValueFn);
    delete this._assignValueFn;
  }
}

class Layout extends TagMemDb {
  constructor(txt) { super(txt); }
}

class Instructions extends TagMemDb {
  constructor(txt) {
    super(txt);
    this.js = new InstructionsJs(this);
  }

  // Build instructions for all the css classes
  load() {
    let match, regex = new RegExp(/\.([\w\-]+) *\{/, 'g');
    while ((match = regex.exec(this.style)) !== null) {
      this[match[1]] = {
        type: 'attribute', attr: 'class', value: match[1]
       };
    }
    // Put the instruction stylesheet into the DOM
    let data = this.style.split(/\r\n|\r|\n/);
    data.shift(); // remove the JSON string
    poc2go.styles.setInstructions(data.join(' '));
    delete this.style; // now in DOM all done

    // ----
    // Load instructions that are hHTML
    let html = []; regex = /^\.([\w\-]+) *\{$/;
    let lines = this.html.split(/\r\n|\r|\n/);
    lines.forEach((line, idx) => {
      // Place instruction name as first item in array
      if (!html.length && regex.test(line)) {
        html = [ line.match(regex)[1] ];
        return;
      }
      // Reached the end of instruction definition
      if (html.length && /^} *$/.test(line)) {
        this[html.shift()] = {
           type: 'html', value: html.join('\n')};
        html = [];
        return;
      }
      // Have at least a name in the definition
      if (html.length) { html.push(line); }
    });
    delete this.html; // now in DOM all done

  }

  // See if instruction set has HTML instruction
  hasHtml(instructions) {
    instructions = instructions.replace(/::/g, '');
    let instNames = instructions.split(' ');
    for (let i=0; i<instNames.length; i++) {
      if (!instNames[i]) { continue; }
      let instruction = this.getInstruction(instNames[i]);
      if (instruction && instruction.type === 'html') {
        return true;
      }
    }
    return false;
  }

  parseit(txt) {
    let match;
    let dblColons = [];

    // Escape doc-canvas instructions and Mustache in code tags
    let regex = new RegExp(/<code[ >]+([^]*?)<\/code>/,'g');
    while ((match = regex.exec(txt)) !== null) {
      if (/::/.test(match[1])) {
        dblColons.push(match[0]);
      }
    }

    dblColons.forEach(codeblock => {
      txt = txt.replace(codeblock,
        codeblock.replace(/::/g, '&#58;&#58;'));
    });

    // Find instructions that are framed in a paragraph
    // These instructions will be applied to the HTML tag
    //  that follows the paragraph
    let loneInst = /<p>(::[^:\n]+::)<\/p>\n(<[^>]+>)/;
    regex = new RegExp(loneInst, 'g');
    while ((match = regex.exec(txt)) !== null) {
      if (!this.hasHtml(match[1])) {
        txt = txt.replace(match[0], match[2] + match[1]);
      }
    }

    // Move instructions in front of HTML tags to
    //  immediately follow the HTML tag
    let imgTag = /(::[A-Za-z0-9_ %\-\/\.]*::) *(<[^>]+>)/;
    regex = new RegExp(imgTag, 'g');
    while ((match = regex.exec(txt)) !== null) {
      if (!/^<\//.test(match[2]) && !this.hasHtml(match[1])
        && match[1].indexOf('::pre ') !== 0) {
        txt = txt.replace(match[0], match[2] + match[1]);
      }
    }

    // Convert ::instructionName ...::
    //  to Mustache {{#i}}instructionName ...{{/i}}
    let tagText = /(:?<[^<]+> *)?::[A-Za-z0-9_ %\-\/\.]*::/;
    let txta = txt.split(/\r\n|\r|\n/);
    for (let i = 0; i < txta.length-1; i++) {
      let line = txta[i].replace(/ *$/,'');
      // Find doc-canvas instructions and convert to mustache
      // Include the leading  HTML tag if there is one
      let match;
      let regex = new RegExp(tagText, 'g');
      while ((match = regex.exec(line)) !== null) {
        line = line.replace(match[0], '{{#i}}' +
          match[0].replace('::', ' ').replace('::', '') + '{{/i}}');
      }
      txta[i] = line;
    }
    // Can now put the '::' back in code blocks
    return txta.join('\n').replace(/&#58;&#58;/g, '::');
  }

  getInstruction(instructionName) {
    instructionName = instructionName.trim();

    // Tag is already defined so all done
    if (this[instructionName]) { return this[instructionName]; }

    return this.js.checkInstructionName(instructionName);
  }
}
