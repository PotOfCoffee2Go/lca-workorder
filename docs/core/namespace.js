// Main namespace - poc2go
// Controls loading the web page and
//   references to document, localStorage, and stylesheets
class Poc2go {
  constructor(config) { this.init(config); }

  init(config) {
    this.spinner = new Spinner;
    Object.assign(this,  {
      config: config,
      default: { md: 'index.md' },
      params:  { md: 'md', text: 'text' },
      url: { params: new URLSearchParams(window.location.search) },
      panel: document.getElementById('panel'),
      ready: false,       // True when document fully loaded

      fetch: new Fetch,   // Fetch files from server
      on: new On,         // Loading stages get, rendered, loaded

      render: new Render, // Rendering storage/code
      store: new Store,   // localStorage database

      styles: new Styles, // Dynamic CSS sheet
      theme: new Theme,   // Color scheme
      hljscss: new HljsCss,  // Dynamic highlight.js stylesheet

      inlineStyles: new InlineStyles,   // Inline styles
      inlineScripts: new InlineScripts, // Inline scripts
      include: new Include, // Embed document as a code block

      // Dynamically loaded
      instructions: null, // Doc-canvas instruction handling
      dom: null,          // DOM listeners see listeners.js
      
      // Reference to Markdown and Mustache markup engines
      markit: (txt) => this.markdown.render(txt),
      renderit: Mustache.render,

      // Instantiate markdown-it renderer with highlight.js
      markdown: window.markdownit({
        html: true, linkify: false, typographer: true,
        highlight: (str, lang) => {
          // md have custom highlighting
          let wrapcode = '';
          if (lang === 'md') { wrapcode = 'wrapcode'; }
          if (lang && hljs.getLanguage(lang)) {
            try {
              return `<pre class="${wrapcode}">` +
                `<code class="language-${lang}">` +
                hljs.highlight(lang, str, true).value +
               '</code></pre>';
            } catch (__) {}
          }
          try {
            return hljs.highlightAuto(str).value;
          } catch (__) {}
          return ''; // use external default escaping
        }
      }) // markdown
    }); // Object assign
  } // init

  // Fetch resources and content
  fetchDocument() {
    return Promise.all([
      this.fetch.instructions(),
      this.fetch.hljscss(),
      this.fetch.layout(),
      this.fetch.content()
    ])
    .then(fetched => this.loadDoc(fetched[3])) // content
    .then(() => this.scrollToAnchor())
    .then(() => this.spinner.end())
    //.catch(err => { alert(err); });
  }

  // Load the document to the DOM
  loadDoc(txt) {
    this.panel.innerHTML =
      this.on.rendered(
          this.renderit(
            this.markit(this.on.fetched(txt)), this.render));
    this.on.loaded();
  }

  // Scroll to the anchor given in URL hash (#anchor-name)
  scrollToAnchor() {
    let hash = location.hash;
    location.hash = '';
    location.hash = hash;
    return hash;
  }
}

// Document construction stages
class On {
  constructor () { this.init() }
  init() {}

  // Document received before parse/rendering
  fetched(txt) {
    txt = poc2go.inlineStyles.reposit(txt);
    txt = poc2go.inlineScripts.reposit(txt);
    return poc2go.instructions.js.onFetched(txt);
  }

  // Document after parse and rendered but before added to DOM
  rendered(txt) {
    txt = poc2go.inlineScripts.reposit(txt);
    txt = poc2go.inlineStyles.inject(txt);
    return poc2go.instructions.js.onRendered(txt);
  }

  // Document has been loaded to DOM
  loaded() {
    poc2go.instructions.js.onLoaded();
    poc2go.ready = true;
    poc2go.instructions.js.onReady();
    this.ready();
  }

  // Document assigned function
  //  ie: poc2go.on.ready = () => { console.log('ready!'); }
  ready() { () => {} }
}
