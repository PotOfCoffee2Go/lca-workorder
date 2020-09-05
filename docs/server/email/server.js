require('dotenv').config({ path: require('os').homedir() + '/.env' });

const nodemailer = require('nodemailer');
const log = console.log;


// Step 1
exports.transporter = nodemailer.createTransport({
  host: "lca.poc2go.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Step 2
let mailOptions = {
    from: 'lcawo@lca.poc2go.com', // TODO: email sender
    to: 'kim@lca.poc2go.com', // TODO: email receiver
    subject: 'Task #3 LCA-765',
    text: 'Place this in your calendar',
    attachments: [
        { filename: 'workorders/order765.ics', path: './workorders/order765.ics' } // TODO: replace it with your own image
    ]
};

// Step 3
/*
transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return log('Error occurs');
    }
    return log('Email sent!!!');
});
*/
exports.sendmail = (mailOptions, cb) => exports.transporter.sendMail(mailOptions, cb);
