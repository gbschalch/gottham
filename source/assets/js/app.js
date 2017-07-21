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

/*var lat = '20',
	long = '25';

apiRequest('get', 'http://code-challenge.maplink.com.br/coordinate?q='+lat+','+long).then(function(response) {
	console.log(response);
});*/