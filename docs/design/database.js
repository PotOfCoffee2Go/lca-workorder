/* Persist values between web pages in localstorage */
class Store {
  constructor() { this.init(); }

  // Reset localStorage if asked in the querystring
  init() {
    let params = new URLSearchParams(window.location.search);
    if (params.get('reset')) { this.clear(); }
  }

  // Get localStorage.values
  //  let obj = poc2go.store.db;
  get db() {
    return JSON.parse(localStorage.values
      ? localStorage.values
      : this.clear());
   }

  // Update localStorage.values
  //   poc2go.store.update = {section: {field: value}};
  set update(obj) {
    let values = this.db;
    values = this.merge(values, obj);
    localStorage.values = JSON.stringify(values);
  }

  // Deep merge `source` data object to a `target` recursively
  // https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
  merge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) {
        Object.assign(source[key], this.merge(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source)
    return target
  }

  // Reset localStorage to default values
  clear() {
    localStorage.clear();
    let database = new Database;
    localStorage.values = JSON.stringify(database.localStorage);
    return localStorage.values;
  }

  // Browser friendly JSON display of localStorage values
  settings() {
    return '<pre>\n' + JSON.stringify(this.db, null, 2) + '\n</pre>';
  }

  // Save localStorage to a local file
  exportData() {
    return btoa(JSON.stringify({ values: this.db }, null, 2));
  }

  // Read localStorage from exported file
  importData(data) {
    this.update = JSON.parse(data).values;
  }
}

// Values used throughout doc-canvas
class Database {
  constructor() { this.init(); }

  init() {

// Configuration
this.config = {
  instructions: {
    css: 'instructions/site.css',
    html: 'instructions/site.html',
    attr: 'instructions/site.attr',
  },
  design: {
    layout: { html: 'design/layout.html' },
    theme: { css: 'design/theme.css' },
    highlight: { css: '//cdn.jsdelivr.net/gh/highlightjs/' +
            'cdn-release@9.18.0/build/styles/' },
    codemirror: { css: '//cdn.jsdelivr.net/npm/' +
            'codemirror@5.52.0/theme/' },
  },
  lca: {
    workorderDb: 'https://lca.ngrok.io/'
  }
}

// Default localStorage settings
this.localStorage = {
  theme: {
    clrbackgrnd: "#000000",
    clrtext: "#c4b8b3",
    clrheading: "#ffff00",
    clrborder: "#000000",
    clricon: "#ffff00"
  },
  id: {
    textSize: "100",
    textSpace: "38",
    textOffset: "22"
  },
  highlight: {
    name: "agate"
  },
  codemirror: {
    name: "lesser-dark"
  },
  opts: {
    tocstyle: "none"
  }
}

// Highlight.js themes
this.highlightjs = {
  themes: [
    'default','a11y-dark','a11y-light','agate','an-old-hope',
    'androidstudio','arduino-light','arta','ascetic',
    'atelier-cave-dark','atelier-cave-light','atelier-dune-dark',
    'atelier-dune-light','atelier-estuary-dark',
    'atelier-estuary-light','atelier-forest-dark',
    'atelier-forest-light','atelier-heath-dark',
    'atelier-heath-light','atelier-lakeside-dark',
    'atelier-lakeside-light','atelier-plateau-dark',
    'atelier-plateau-light','atelier-savanna-dark',
    'atelier-savanna-light','atelier-seaside-dark',
    'atelier-seaside-light','atelier-sulphurpool-dark',
    'atelier-sulphurpool-light','atom-one-dark-reasonable',
    'atom-one-dark','atom-one-light','brown-paper','codepen-embed',
    'color-brewer','darcula','dark','darkula','docco','dracula',
    'far','foundation','github-gist','github','gml','googlecode',
    'gradient-dark','grayscale','gruvbox-dark','gruvbox-light',
    'hopscotch','hybrid','idea','ir-black','isbl-editor-dark',
    'isbl-editor-light','kimbie.dark','kimbie.light','lightfair',
    'magula','mono-blue','monokai-sublime','monokai','night-owl',
    'nord','obsidian','ocean','paraiso-dark','paraiso-light',
    'pojoaque','purebasic','qtcreator_dark','qtcreator_light',
    'railscasts','rainbow','routeros','school-book',
    'shades-of-purple','solarized-dark','solarized-light',
    'sunburst','tomorrow-night-blue','tomorrow-night-bright',
    'tomorrow-night-eighties','tomorrow-night','tomorrow',
    'vs','vs2015','xcode','xt256','zenburn',
  ],
  buildSelect: (id='hilightcss') => {
    let html ='';
    this.highlightjs.themes.forEach(theme => {
      html += '<option value="' + theme + '">' + theme + '</option> ';
    });
    return '<span><label for="hilightcss">Highlight theme </label>' +
    '<select id="' + id + '" name="hilightcss">' + html + '</select>' +
    '</span>'
  },
  tokens: [
  'addition', 'annotaion', 'annotation', 'argument', 'array',
  'at_rule', 'attr_selector', 'attribute', 'begin-block',
  'blockquote', 'body', 'built_in', 'bullet', 'cbracket',
  'cdata', 'cell', 'change', 'char', 'chunk', 'class', 'code',
  'collection', 'command', 'commands', 'commen', 'comment',
  'constant', 'container', 'dartdoc', 'date', 'decorator',
  'default', 'deletion', 'doctype', 'emphasis', 'end-block',
  'envvar', 'expression', 'filename', 'filter', 'flow', 'foreign',
  'formula', 'func', 'function', 'function_name', 'generics',
  'header', 'hexcolor', 'horizontal_rule', 'id', 'import',
  'important', 'infix', 'inheritance', 'input', 'javadoc',
  'javadoctag', 'keyword', 'keywords', 'label', 'link_label',
  'link_reference', 'link_url', 'list', 'literal', 'localvars',
  'long_brackets', 'matrix', 'module', 'number', 'operator',
  'output', 'package', 'param', 'parameter', 'params',
  'parent', 'phpdoc', 'pi', 'pod', 'pp', 'pragma', 'preprocessor',
  'prompt', 'property', 'pseudo', 'quoted', 'record_name',
  'regex', 'regexp', 'request', 'reserved', 'rest_arg', 'rules',
  'shader', 'shading', 'shebang', 'special', 'sqbracket',
  'status', 'stl_container', 'stream', 'string',  'strong',
  'sub', 'subst', 'summary', 'symbol', 'tag', 'template_comment',
  'template_tag', 'title', 'type', 'typedef', 'typename',
  'value', 'var_expand', 'variable', 'winutils', 'xmlDocTag',
  'yardoctag'
  ]
}

// CodeMirror themes
this.codemirror = {
  themes: [
    '3024-day','3024-night','abcdef','ambiance-mobile',
    'ambiance','ayu-dark','ayu-mirage','base16-dark',
    'base16-light','bespin','blackboard','cobalt',
    'colorforth','darcula','dracula','duotone-dark',
    'duotone-light','eclipse','elegant','erlang-dark',
    'gruvbox-dark','hopscotch','icecoder','idea',
    'isotope','lesser-dark','liquibyte','lucario',
    'material-darker','material-ocean','material-palenight',
    'material','mbo','mdn-like','midnight',
    'monokai','moxer','neat','neo','night',
    'nord','oceanic-next','panda-syntax','paraiso-dark',
    'paraiso-light','pastel-on-dark','railscasts',
    'rubyblue','seti','shadowfox','solarized',
    'ssms','the-matrix','tomorrow-night-bright',
    'tomorrow-night-eighties','ttcn','twilight',
    'vibrant-ink','xq-dark','xq-light','yeti',
    'yonce','zenburn'
  ],
  buildCssSelect: (id='codemirrorcss') => {
    let html ='';
    this.codemirror.themes.forEach(theme => {
      html += '<option value="' + theme + '">' + theme + '</option> ';
    });
    return '<span><label for="codemirrorcss">Editor theme </label>' +
    '<select id="' + id + '" name="codemirrorcss">' + html + '</select>' +
    '</span>'
  }


}

  } // init
} // class Database
