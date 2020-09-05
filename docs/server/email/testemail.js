const email = require('./server');
const log = console.log;

email.sendmail({
    from: 'lcawo@lca.poc2go.com', // TODO: email sender
    to: 'kim@lca.poc2go.com', // TODO: email receiver
    subject: 'Test as a module',
    text: 'Just a test of using the email system.',
  }, (err) => { if (err) log(err); else log('success'); });
