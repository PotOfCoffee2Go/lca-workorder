class InstructionsJs {
  constructor(db) { this.init(db); }

  init(db) {
    Object.assign(this, {
      db: db,
      colors: [
        'clrbackgrnd',
        'clrborder',
        'clrtext',
        'clrheading',
        'clricon'
      ]
    });
  }

  // ---
  // Document construction stages

  // Document received before markup/parse/rendered
  onFetched(txt) {
    // scripts run against fetched document before instructions
    txt = poc2go.inlineScripts.run('fetched',txt);
    // Markup document information lines with Mustache tags
    txt = poc2go.render._docinfo.createMustacheTags(txt);
    // Wrap the document with layout header and footer
    return '{{{header}}}\n' + txt + '\n{{{footer}}}\n';
  }

  // Document after parse and rendered but before added to DOM
  onRendered(txt) {
    // Load the doc-canvas instructions/site.css and .html
    poc2go.instructions.load();
    // Create the Mustache tags for inline HTML substitutions
    txt = poc2go.renderit(
      poc2go.instructions.parseit(txt), poc2go.render);
    // Scripts run on the rendered document after instructions
    txt = poc2go.inlineScripts.run('rendered', txt);
    // Highlight any included files
    return poc2go.include.inject(txt);
  }

  // Document has been loaded to DOM
  onLoaded() {
    // Load dynamic stylesheets
    poc2go.styles.set();
    // Load the DOM listeners
    poc2go.dom = new DOMListeners;
    // Run scripts
    poc2go.inlineScripts.run('loaded');
    // Assign classes to 'pre' for styles of code blocks
    poc2go.hljscss.styleCodeBlocks();
  }

  // All standard processing has completed
  onReady() {
  }

  // ----
  themeColor(color) {
    if (this.colors.indexOf(color) > -1) {
      return `var(--${color})`;
    }
    return null;
  }

  // ----
  // Instructions implemented in Javascript
  checkInstructionName(instructionName) {
    // WxH - 1x1 2x2 3x6 etc. Unit is char size (em)
    if (/^[0-9\.]+x[0-9\.]+$/.test(instructionName)) {
      let width = instructionName.match(/^[0-9\.]+/);
      let height = instructionName.match(/[0-9\.]+$/);
      return {
        type: 'attribute', attr: 'style',
        value: `width:${width}em; height:${height}em;`
      }
    }

    // Wx - 1x 2x 3x etc. Height is auto - Unit is char size (em)
    if (/^[0-9\.]+x$/.test(instructionName)) {
      let width = instructionName.match(/^[0-9\.]+/);
      return {
        type: 'attribute', attr: 'style',
        value: `width:${width}em;`
      }
    }

    // Hy - 1y 2y 3y etc. Width is auto - Unit is char size (em)
    if (/^[0-9\.]+y$/.test(instructionName)) {
      let height = instructionName.match(/^[0-9\.]+/);
      return {
        type: 'attribute', attr: 'style',
        value: `height:${height}em;`
      }
    }

    // margin-Nt-Nr-Nb-Nl - Width is auto, unit is char size (em)
    if (/^margin(?:-[0-9\.px]+){1,4}$/.test(instructionName)) {
      let match = (instructionName+'-0-0-0-0').split('-');
      match.shift(); // remove 'margin'
      while (match.length > 4) { match.pop(); } // remove defaults
      let value = 'margin: ';
      match.forEach(m => {
        if (/px/.test(m)) {
          value += m + ' ';
        }
        else {
          value += m !== '0' ? m + 'em ' : '0 ';
        }
      });
      return {
        type: 'attribute', attr: 'style',
        value: value + ';'
      }
    }

    // padding-Nt-Nr-Nb-Nl - Width is auto, unit is char size (em)
    if (/^padding(?:-[0-9\.px]+){1,4}$/.test(instructionName)) {
      let match = (instructionName+'-0-0-0-0').split('-');
      match.shift(); // remove 'padding'
      while (match.length > 4) { match.pop(); } // remove defaults
      let value = 'padding: ';
      match.forEach(m => {
        if (/px/.test(m)) {
          value += m + ' ';
        }
        else {
          value += m !== '0' ? m + 'em ' : '0 ';
        }
      });
      return {
        type: 'attribute', attr: 'style',
        value: value + ';'
      }
    }

    // W% - width percent of parent width
    if (/^[0-9]+%$/.test(instructionName)) {
      let width = instructionName.match(/^[0-9]+/);
      return {
        type: 'attribute', attr: 'style',
        value: `width:${width}%;`
      }
    }

    // Foundations Icon
    if (/^fi-/.test(instructionName)) {
      return {
        type: 'html',
        value: `<i class="${instructionName}"></i>`
      }
    }

    // Google Material Icon
    if (/^mi-\w+/.test(instructionName)) {
      let icon = instructionName.match(/^mi-(\w+)/);
      return {
        type: 'html',
        value: `<i class="material-icons">${icon[1]}</i>`
      }
    }

    // Captain Icons
    if (/^ci-icon-[0-9]{3}$/.test(instructionName)) {
      let icon = instructionName.match(/^ci-(icon-[0-9]{3})$/);
      return {
        type: 'html',
        value: `<span class="${icon[1]}"></span>`
      }
    }

    // Set text size - tx-1, ... Font size - Unit is char size (em)
    if (/^tx-[0-9\.]+$/.test(instructionName)) {
      let size = instructionName.match(/^tx-([0-9\.]+$)/)[1];
      return {
        type: 'attribute', attr: 'style',
        value: `font-size:${size}em;`
      }
    }

    // Set text color to HTML color text ie: aliceblue
    if (/^tx-[A-Za-z]+$/.test(instructionName)) {
      let color = instructionName.match(/^tx-([A-Za-z]+$)/)[1];
      color = this.themeColor(color) || color;
      return {
        type: 'attribute', attr: 'style',
        value: `color:${color};`
      }
    }

    // Set background color HTML color text ie: aliceblue
    if (/^bg-[A-Za-z]+$/.test(instructionName)) {
      let color = instructionName.match(/^bg-([A-Za-z]+$)/)[1];
      color = this.themeColor(color) || color;
      return {
        type: 'attribute', attr: 'style',
        value: `background-color:${color};`
      }
    }

    // Set id
    if (/^id-[A-Za-z0-9\-]+$/.test(instructionName)) {
      let id = instructionName.match(/^id-([A-Za-z0-9\-]+$)/)[1];
      return {
        type: 'attribute', attr: 'id',
        value: id
      }
    }

    // Set class
    if (/^cl-[A-Za-z0-9\-]+$/.test(instructionName)) {
      let cl = instructionName.match(/^cl-([A-Za-z0-9\-]+$)/)[1];
      return {
        type: 'attribute', attr: 'class',
        value: cl
      }
    }

    // Set div with an id
    if (/^div-[A-Za-z0-9\-]+$/.test(instructionName)) {
      let id = instructionName.match(/^div-([A-Za-z0-9\-]+$)/)[1];
      return {
        type: 'html',
        value: `<div id="${id}"></div>`
      }
    }

    // Opacity - 0 thru 9
    if (/^dim-[0-9]$/.test(instructionName)) {
      let opacity = '.' + instructionName.match(/^dim-([0-9]$)/)[1];
      return {
        type: 'attribute', attr: 'style',
        value: `opacity:${opacity};`
      }
    }

    // Rotate left/right by degrees 0 - 360
    if (/^(?:tx-)?rotate-(?:left-)?[0-9]+$/.test(instructionName)) {
      let rotate = instructionName.match(/^(?:tx-)?rotate-((?:left-)?)([0-9]+$)/);
      let direction = rotate[1] === 'left-' ? '-' : '';
      let degrees = rotate[2];
      return {
        type: 'attribute', attr: 'style',
        value: `transform:rotate(${direction + degrees}deg);`
      }
    }

    // Scale(x)
    if (/^(?:tx-)?scale-[0-9.]+$/.test(instructionName)) {
      let scale = instructionName.match(/^(?:tx-)?scale-([0-9.]+$)/);
      return {
        type: 'attribute', attr: 'style',
        value: `transform:scale(${scale[1]});`
      }
    }

    return null;
  }
}

