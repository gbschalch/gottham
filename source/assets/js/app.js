$(document).foundation();

Ractive.DEBUG = false;

var gotthamView = new Ractive({
	target: '#view-body',
	template: '#baseView',

	data: function() {
		return {
			mainTitle : 'Gottham Anti-Evil System',
			cursorY : 0,
			cursorX : 0,
			showCursor: false,
			loadingPositions: false,
			showingPositions: false
		};
	},

	oncomplete: function() {
		var batMap = document.getElementById('batMap');
		batMap.addEventListener('mousemove', gotthamView.followPointer);
	},

	calcBatmanCoords: function() {

		return new Promise( function(resolve, reject) {

			/* Primeiro declaramos todas as informações que vamos utilizar do elemento:
			dimensões e posicionamento referente a tela e a página,
			e também a posição do clique que foi dado; */
			var batMap = document.getElementById('batMap'),
				batMapInfo = batMap.getBoundingClientRect(),
				canvasTop = batMapInfo.top + window.scrollY,
				canvasLeft = batMapInfo.left + window.scrollX,
				canvasWidth = batMapInfo.width,
				canvasHeight = batMapInfo.height,
				posY = this.get('cursorY'),
				posX = this.get('cursorX'),
				gotthamBounds = { vSize : 40.763328 - 40.746422, hSize : 73.994753 - 73.968039 },
				clickVertPercent, clickHorizPercent, finalLat, finalLong; 

			// Em seguida, é feita a conta onde descobrimos no elemento o local (em % arredondada) do clique vertical e horizontalmente;
			clickVertPercent = ((posY - canvasTop) * 100) / canvasHeight;
			clickHorizPercent = ((posX - canvasLeft) * 100) / canvasWidth;

			// Agora descobrimos comparando com o "tamanho de Gottham City" a % arredondada para conseguir a latitude e longitude referentes a %;
			finalLat  = 40.763328 - (gotthamBounds.vSize * (clickVertPercent / 100));
			finalLong = -73.994753 - (-(gotthamBounds.hSize * (clickHorizPercent / 100)));

			finalLat = finalLat.toString().substr(0, 9);
			finalLong = finalLong.toString().substr(0, 10);

			console.log(finalLat, finalLong);

			var fakeResponse = {
				"villain" : {
					"name":"Joker",
					"location" : {"lat":40.759653,"lng":-73.988094}
				},
				"targets": [
					{"place":
						"Gotham Arms Apartment",
						"location":{"lat":40.761687,"lng":-73.981873},
						"probability":71.46564928602965
					},
					{"place":"GCPD Headquarters",
					"location" : {"lat":40.753645,"lng":-73.988117},
					"probability":66.59690359211325
					},
					{"place":"Giordano Botanical Gardens",
					"location":{"lat":40.753875,"lng":-73.983745},
					"probability":63.02129373601436
					},
					{"place":"Wayne Enterprises",
					"location":{"lat":40.759134,"lng":-73.979021},
					"probability":61.68230931252116
					},
					{"place":"Gotham City Hall",
					"location":{"lat":40.75317,"lng":-73.981972},
					"probability":55.68409625281383
					},
					{"place":"The Clocktower",
					"location":{"lat":40.755469,"lng":-73.976731},
					"probability":46.7916593698551
					},
					{"place":"Old Gotham Subway",
					"location":{"lat":40.759941,"lng":-73.975449},
					"probability":46.72469455980166
					},
					{"place":"Gotham University",
					"location":{"lat":40.753722,"lng":-73.977494},
					"probability":44.5005516841389
					},
					{"place":"Amusement Mile",
					"location":{"lat":40.748288,"lng":-73.985791},
					"probability":36.073374612450365
					},
					{"place":"Special Crimes Unit",
					"location":{"lat":40.749428,"lng":-73.976931},
					"probability":26.229771467760116
					}
				]
			};

			//apiRequest('get', 'http://code-challenge.maplink.com.br/coordinate?q='+finalLat+','+finalLong).then(function(response) {
			//	console.log(response);
			//});

			resolve(fakeResponse);

		}.bind(this));

	},

	handleMouseCursor: function(isOver) {
		var batContainer = document.getElementById('batContainer');
		if (isOver) {
			gotthamView.set('showCursor', true);
		} else {
			if (!gotthamView.get('loadingPositions') && !gotthamView.get('showingPositions')) {
				gotthamView.set('showCursor', false);
			}
		}
	},

	followPointer: function(event) {
		if (!gotthamView.get('loadingPositions') && !gotthamView.get('showingPositions')) {
			gotthamView.set('cursorY', event.pageY);
			gotthamView.set('cursorX', event.pageX);
		}
	},

	calcVillainCoords: function(response) {
		var finalTargets = response.targets,
			sortedTargets = _.sortBy(finalTargets, 'probability')
			sortedTargets = sortedTargets.reverse();

		this.set('villainData', response.villain);
		this.set('villainTargets', sortedTargets);
	},

	pinPoint: function() {
		if (!gotthamView.get('showingPositions')) {
			this.set('loadingPositions', true);
			this.calcBatmanCoords().then(function(response) {
				setTimeout(function() {
					this.set('showingPositions', true);
					this.set('loadingPositions', false);
					this.calcVillainCoords(response);
				}.bind(this), 400);
			}.bind(this));
		}
	}
});