'use strict';
const model = require('./model');


module.exports = function(app) {


  app.route('/tt')
  .get((req, res, next) => {
		//res.poc2go.body = '<h3>Wow! it works!</h3>'// {tt: req.poc2go.format};
		next();
		})
	


/*
	app.route('/schema')
		.get(middle.read_schema);

	app.route('/all')
		.get(middle.read_all);

	app.route('/test/:id')
		.get(middle.test);

	app.route('/company/:id')
		.get(middle.read_a_company);
//		.put(middle.update_a_task)
//		.delete(middle.delete_a_task);

	app.route('/record/:id')
		.get(middle.get_a_record);

	app.route('/csv/records/:id/:type?')
		.get(middle.csv_records);

	app.route('/csv/company/:id')
		.get(middle.csv_company);

	// middle Routes
	app.route('/list')
//		.get(middle.list_all_customers);
		.post(middle.list_query);

	app.route('/find')
//		.get(middle.list_all_customers);
		.post(middle.find_query);

	app.route('/add')
//		.get(middle.list_all_customers);
		.post(middle.add_query);

	app.route('/update')
//		.get(middle.list_all_customers);
		.post(middle.update_query);


	// middle Routes
	app.route('/tasks')
		.get(middle.list_all_tasks)
		.post(middle.create_a_task);

	app.route('/tasks/:taskId')
		.get(middle.read_a_task)
		.put(middle.update_a_task)
		.delete(middle.delete_a_task);
*/
};
