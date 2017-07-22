$(document).foundation();

Ractive.DEBUG = false;

var gotthamView = new Ractive({
	target: '#view-body',
	template: '#baseView',

	data: function() {
		return {
			mainTitle : 'Gottham Anti-Evil System'
		};
	},

	oncomplete: function() {
		var batMap = document.getElementById('batMap');
		batMap.addEventListener('mousemove', gotthamView.followPointer);
	},

	handleMouseCursor: function(isOver) {
		var batMap = document.getElementById('batMap'),
			batContainer = document.getElementById('batContainer');
		if (isOver) {
			batContainer.classList.add('batmask');
		} else {
			batContainer.classList.remove('batmask');
		}
	},

	followPointer: function(event) {
		console.log(event);
	}
});

/*var lat = '20',
	long = '25';

apiRequest('get', 'http://code-challenge.maplink.com.br/coordinate?q='+lat+','+long).then(function(response) {
	console.log(response);
});*/