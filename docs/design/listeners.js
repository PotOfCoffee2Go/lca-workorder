// Attach DOM Elements to listeners
class DOMListeners {
  constructor() { this.init(); }

  init() {
    // Assign listener to element using id attribute
    this.listeners = {
      'hilightcss': this.hilightcssOninput.bind(this),
      'btnSettings': this.showSettingsOnclick.bind(this),
      'textSize': this.textSizeOninput.bind(this),
      'textOffset': this.textOffsetOninput.bind(this),
      'textSpace': this.textSpaceOninput.bind(this),
      'clrtext': this.clrtextOnchange.bind(this),
      'clrbackgrnd': this.clrbackgrndOnchange.bind(this),
      'clrheading': this.clrheadingOnchange.bind(this),
      'clrborder': this.clrborderOnchange.bind(this),
      'clricon': this.clriconOnchange.bind(this),
      'importBtn': this.importBtnOnclick.bind(this),
      'getFile': this.getFileOnchange.bind(this),
      'btnReadTheme': this.btnReadThemeOnclick.bind(this),
      'readThemeFile': this.readThemeFileOnchange.bind(this),
      'btnSaveTheme': this.saveThemeBtnOnclick.bind(this),
      'btnResetSettings': this.resetSettingsOnclick.bind(this),
      'btnShowMe': this.btnShowMeOnclick.bind(this),
      'btnContents': this.btnContentsOnclick.bind(this),
      'anchorlinks': this.btnContentsOnclick.bind(this),
    };

    window.onresize = () => {
      poc2go.dom.listeners.textSize();
    };

    this.getElementsWithIdAttr();
  }
  // --------


  // Listeners
  hilightcssOninput() {
    if (!this.hilightcss.value) {
      this.hilightcss.value = poc2go.store.db.highlight.name;
    }
    poc2go.hljscss.get(this.hilightcss.value);
  }

  showSettingsOnclick() {
    if (this.settingsDiv.style.display === 'none') {
      this.settingsDiv.style.display = 'block';
    }
    else {
      this.settingsDiv.style.display = 'none';
    }
  }

  btnShowMeOnclick() {
    if (this.showme.style.display === 'none') {
      this.showme.innerHTML = poc2go.store.settings();
      this.showme.style.display = 'block';
    }
    else {
      this.showme.style.display = 'none';
    }
  }

  btnContentsOnclick() {
    if (this.toc.style.display === 'none') {
      poc2go.styles.setTocStyle(this.toc, 'block');
      window.scrollTo(0,0); // required if #toc position:relative;
      // For now - Do not show TOC when going to another document
      //poc2go.store.update = {opts: {tocstyle: 'block'}};
    }
    else {
      poc2go.styles.setTocStyle(this.toc, 'none');
      poc2go.store.update = {opts: {tocstyle: 'none'}};
      this.textSizeOninput(); // textSize slider may need resizing
    }
  }

  resetSettingsOnclick() {
    poc2go.store.clear();

    this.getElementsWithIdAttr();
    poc2go.theme.init();
  }

  clrtextOnchange() {
    poc2go.store.update = {theme: {clrtext: this.clrtext.value}};
    poc2go.theme.set(poc2go.store.db.theme);
  }
  clrbackgrndOnchange() {
    poc2go.store.update = {theme: {clrbackgrnd: this.clrbackgrnd.value}};
    poc2go.theme.set();
  }
  clrheadingOnchange() {
    poc2go.store.update = {theme: {clrheading: this.clrheading.value}};
    poc2go.theme.set();
  }
  clrborderOnchange() {
    poc2go.store.update = {theme: {clrborder: this.clrborder.value}};
    poc2go.theme.set();
  }
  clriconOnchange() {
    poc2go.store.update = {theme: {clricon: this.clricon.value}};
    poc2go.theme.set();
  }

  textSizeOninput() {
    this.panel.style.fontSize = `${1.5+(this.textSize.value/100)}em`;
    poc2go.store.update = {id: {textSize: this.textSize.value}};

    // Resize the range element on to right to prevent wrapping
    var srect = this.btnSettings.getBoundingClientRect();
    var prect = this.panel.getBoundingClientRect();
    let newWidth = (prect.right - srect.right - 50);
    this.textSize.style.width = '' + newWidth + 'px';
  }
  textOffsetOninput() {
    this.panel.style.paddingLeft =
      this.panel.style.paddingRight = `${0+this.textOffset.value*2}px`;
    poc2go.store.update = {id: {textOffset: this.textOffset.value}};
  }
  textSpaceOninput() {
    this.panel.style.lineHeight = `${this.textSpace.value}px`;
    poc2go.store.update = {id: {textSpace: this.textSpace.value}};
  }

  importBtnOnclick() {
    this.getFile.click();
  }
  getFileOnchange(evt) {
    if (evt) {
      var reader = new FileReader();
      reader.onload = (event) => {
        poc2go.loadDoc(poc2go.panel, event.target.result); // event.target ref FileReader
      };
      reader.readAsText(evt.target.files[0]); // FileList object
    }
  }

  btnReadThemeOnclick() {
    this.readThemeFile.click();
  }
  readThemeFileOnchange(evt) {
    if (evt) {
      var reader = new FileReader();
      reader.onload = (event) => {
        poc2go.store.importData(event.target.result); // event.target ref FileReader
        this.getElementsWithIdAttr();
        poc2go.theme.init();
      };
      reader.readAsText(evt.target.files[0]); // FileList object
    }
  }

  saveThemeBtnOnclick() {
    let dataBase64 = poc2go.store.exportData();
    this.saveThemeFile.download = `theme.json`;
    this.saveThemeFile.href = `data:application/octet-stream;charset=utf-8;base64,${dataBase64}`;
    this.saveThemeFile.click();
  }

  // --------

  // Assigns listeners to elements
  getElementsWithIdAttr() {
    // Assign all DOM elements that have 'id=' attribute
    //  may overwrite settings defined above
    document.querySelectorAll("[id]")
      .forEach(element => this[element.id] = element);

    // Assign values from localStorage
    //  and add listeners when/if user changes values
    let values = poc2go.store.db;
    values.id = values.id || {};
    Object.keys(this).forEach(element => {
      if (element === 'anchorlinks') { // handle TOC links
        // Place tag values into DOM
        this.anchorlinks
          .innerHTML = poc2go.render._anchors.join(' ') + '<hr>';
        this.anchorlinks.onclick = this.listeners[element];
      }
      else if (this[element].type && this.listeners[element]) {
        if (this[element].type === 'range' || element === 'hilightcss') {
          this[element].value = values.id[element] || '0';
          this[element].oninput = this.listeners[element];
          this[element].oninput();
        }
        else if (this[element].type === 'button') {
          this[element].onclick = this.listeners[element];
        }
        else if (this[element].type === 'color') {
          this[element].value = values.theme[element];
          this[element].onchange = this.listeners[element];
          this[element].onchange();
        }
        else if (this[element].type === 'file') {
          this[element].onchange = this.listeners[element];
          this[element].onchange();
        }
      }
    });
  }
}
