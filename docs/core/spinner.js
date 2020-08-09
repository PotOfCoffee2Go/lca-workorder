// Loading spinner...
class Spinner {
  constructor() { this.init() }

  init() {
    try {
      // Will init/reset localStorage if required
      let store = new Store;

      // Set the background - helps prevent flicker - kinda
      let bg = store.db.theme.clrbackgrnd;
      let cssvars = document.documentElement.style; // :root
      cssvars.setProperty('--clrbackgrnd', bg);

      // Load the spinner
      this.start();
    } catch(e) {};
  }

 // Event listener to handle all unhandled Promise errors
  handlePromiseErrors() {
    window.addEventListener("unhandledrejection", event => {
      // Promise is event.promise and the reason is event.reason
      alert(event.reason);
      event.preventDefault();
    }, false);
  }

  start() {
//    this.handlePromiseErrors();
    document.getElementById('spinner')
      .innerHTML = '<div class="sk-circle">::::::::::::</div>'
        .replace(/:/g,'<div class="sk-circle-fade-dot"></div>');

    document.getElementById('panel').style.opacity = 0;
  }

  end() {
    let spinner = document.getElementById('spinner');
    let panel = document.getElementById('panel');
    panel.classList.add('ease-to-view');
    spinner.classList.add('ease-out-of-view');
    panel.style.opacity = spinner.style.opacity = '';

    // Remove the spinner when done
    setTimeout(() => {
      let spinner = document.getElementById('spinner');
      spinner.parentNode.removeChild(spinner);
      document.getElementById('panel')
        .classList.remove('ease-to-view');
      poc2go.spinner = undefined;
    }, 2000);
  }
}
