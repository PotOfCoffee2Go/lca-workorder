'use strict';
const controller = require('./controller');

 module.exports = function(app) {

  app.route('/tt')
  .get((req, res, next) => {
    res.poc2go.body = '<h3>Wow! it works!</h3>'// {tt: req.poc2go.format};
    next();
    })

  app.route('/:format/schema')
    .get(controller.get_schema);

  app.route('/:format/qry/:id?')
    .get(controller.get_qry)  // read
    .post(controller.post_qry) // insert
    .put(controller.put_qry) // update
    .delete(controller.delete_qry); // delete

  app.route('/:format/:type/:id?')
    .get(controller.get_requested_type);

  app.route('/sheet/update')
    .post(controller.post_update);


//    .put(controller.update_a_task)
//    .delete(controller.delete_a_task);

/*
  app.route('/test/:id')
    .get(controller.test);

  app.route('/record/:id')
    .get(controller.get_a_record);

  app.route('/csv/records/:id/:type?')
    .get(controller.csv_records);

  app.route('/csv/company/:id')
    .get(controller.csv_company);

  // controller Routes
  app.route('/list')
//    .get(controller.list_all_customers);
    .post(controller.list_query);

  app.route('/find')
//    .get(controller.list_all_customers);
    .post(controller.find_query);

  app.route('/add')
//    .get(controller.list_all_customers);
    .post(controller.add_query);

  app.route('/update')
//    .get(controller.list_all_customers);
    .post(controller.update_query);


  // controller Routes
  app.route('/tasks')
    .get(controller.list_all_tasks)
    .post(controller.create_a_task);

  app.route('/tasks/:taskId')
    .get(controller.read_a_task)
    .put(controller.update_a_task)
    .delete(controller.delete_a_task);
*/
};
