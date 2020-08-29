'use strict';

module.exports = function(app) {
	var workorder = require('../controllers/workorderController');

	app.route('/schema')
		.get(workorder.read_schema);

	app.route('/all')
		.get(workorder.read_all);

	app.route('/test/:id')
		.get(workorder.test);

	app.route('/company/:id')
		.get(workorder.read_a_company);
//		.put(workorder.update_a_task)
//		.delete(workorder.delete_a_task);

	app.route('/record/:id')
		.get(workorder.get_a_record);

	app.route('/csv/records/:id/:type?')
		.get(workorder.csv_records);

	app.route('/csv/company/:id')
		.get(workorder.csv_company);

	// workorder Routes
	app.route('/list')
//		.get(workorder.list_all_customers);
		.post(workorder.list_query);

	app.route('/find')
//		.get(workorder.list_all_customers);
		.post(workorder.find_query);

	app.route('/add')
//		.get(workorder.list_all_customers);
		.post(workorder.add_query);

	app.route('/update')
//		.get(workorder.list_all_customers);
		.post(workorder.update_query);


	// workorder Routes
	app.route('/tasks')
		.get(workorder.list_all_tasks)
		.post(workorder.create_a_task);

	app.route('/tasks/:taskId')
		.get(workorder.read_a_task)
		.put(workorder.update_a_task)
		.delete(workorder.delete_a_task);
};
