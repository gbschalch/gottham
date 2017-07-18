$(document).foundation();

Ractive.DEBUG = false;

var gotthamView = new Ractive({
	target: '#view-body',
	template: '#baseView',

	data: function() {
		return {

			mainTitle : 'Gottham Project'

		};
	},
});