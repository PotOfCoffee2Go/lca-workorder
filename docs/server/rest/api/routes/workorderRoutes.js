'use strict';

module.exports = function(app) {
	var workorder = require('../controllers/workorderController');

	app.route('/schema')
		.get(workorder.read_schema);

	// workorder Routes
	app.route('/customers')
		.get(workorder.list_all_customers);
//		.post(workorder.create_a_task);

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
