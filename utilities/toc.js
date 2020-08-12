#!/usr/bin/env node

/*
This nodejs program builds a skeletal Table of Contents
  in Markdown for the working and sub-directories in
  which it is run.

Output is to stdout - for example:
   node ./utilities/toc.js > index.md
 from the site root directory would build
 a site wide 'index.md'.
*/

const
  fs = require('fs-extra'),
  dir = require('node-dir'),

  // Include .md files
  // Exclude index.md and node_modules files
  includefiles = /\.md$/,
  excludefiles = /(?:index\.md$)|(?:node_modules)/,

  // Gist files
  gist = 'https://gist.githubusercontent.com/PotOfCoffee2Go/76df271f905ac9d653d8dfb53bced875/raw/',
  gistnames = ['preface.md', 'dingus.md'];

// Information of each markdown file
class MdInfo {
  constructor(fpath) { this.init(fpath); }

  init(fpath) {
    let parts = fpath.split('/');
    Object.assign(this, {
      path: fpath.indexOf('/') > -1 ? fpath : ('/' + fpath),
      tags: parts,
      fname: '',
      title: this.getTitle(fpath),
      href: '?md=' + fpath,
      codehref: '?text=' + fpath,
      indent: parts.length-1,
    });
    this.fname = this.tags.pop();
  }

  // Scan for the title in the document text
  getTitle(fpath) {
    let data = fs.readFileSync('./' + fpath).toString();
    let lines = data.split(/\r\n|\r|\n/);
    let title = '';

    // Remove the markdown '#', any html, and insure single spaces
    for (var i=0; i < lines.length; i++) {
      if (/^# /.test(lines[i])) {
        title = lines[i].replace(/^# /, '')
          .replace(/<.*>/g, '').replace(/ +/g, ' ');
        break;
      }
    }
    return title;
  }
}

class MdList {
  constructor() { this.init(); }

  init() {
    Object.assign(this, {list: [], index: [], text: []});
  }

  getMdFiles() {
    return dir.promiseFiles(process.cwd())
    .then(files => {
      files.forEach(file => {
        if (includefiles.test(file) && !excludefiles.test(file)) {
          this.list.push(
            new MdInfo(file.replace(process.cwd() + '/', ''))
          );
        }
      });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
  }

  // At least one .md file in directory contains a title?
  atLeastOneTitle(idx) {
    for (let e=0; e < this.index[idx].entries.length; e++) {
      if (this.list[this.index[idx].entries[e]].title) {
        return true;
      }
    }
    return false;
  }

  reindex() {
    this.index = [];

    var index = [];
    for (let l=0; l < this.list.length; l++) {
      let path = this.list[l].tags.join('/');
      if (typeof index[path] === 'undefined') { index[path] = []; }
      index[path].push(l);
    }

    Object.keys(index).forEach(key => {
      this.index.push({path: key, entries: index[key]});
    });

    this.index.sort((a, b) => (a.path > b.path) ? 1 : -1);

    this.text = ['# Lowcountry Aviation Workorder Proposal',''];
    for (let i=0; i < this.index.length; i++) {
      if (this.index[i].path && this.atLeastOneTitle(i)) {
        this.text.push('## ' + this.index[i].path + '');
      }
      for (let e=0; e < this.index[i].entries.length; e++) {
        let entry = this.list[this.index[i].entries[e]];
        if (!entry.title) { continue; }
        this.text.push((this.index[i].path?  '  - ' : '') +
          '[' + entry.title + '](' + entry.href + ')');
  //        '[' + entry.title + '](' + entry.href + ') { [' +
  //        entry.fname + '](' + entry.codehref + ') }');
      }
      this.text.push('');
    }
  }

  toString() {
    this.reindex();
    return this.text.join('\n');
  }
}

var mdList = new MdList;
mdList.getMdFiles().then(() => {
  console.log(mdList.toString());
})
.catch(err => {console.error(err)});
