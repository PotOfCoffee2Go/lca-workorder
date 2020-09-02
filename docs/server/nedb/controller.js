
const cl = {} //require('./controller');
const log = console.log;

module.exports =
 function start(req, res, next) {
  req.poc2go = {
  };
  res.poc2go = {
  };

  next();
};
