document.onreadystatechange = () => {
	if (document.readyState === 'complete') {
	
		initializeList();
	
	}
};

function setHumidityLevel(perc) {
	let deg = (perc * 280) / 100
	var activeBorder = document.getElementById("activeBorder");
	
    if (deg <= 140){
        activeBorder.style.backgroundImage ='linear-gradient(' + (90+deg) + 'deg, transparent 50%, #7c8ba1 50%),linear-gradient(90deg, #7c8ba1 50%, transparent 50%)';
    }
    else{
        activeBorder.style.backgroundImage = 'linear-gradient(' + (deg-90) + 'deg, transparent 50%, #fff 50%),linear-gradient(90deg, #7c8ba1 50%, transparent 50%)';
    }
	
	document.getElementById("perc").innerHTML = Math.round(perc)+"%";
}

function initializeList() {
	var text = "";
	for (var i = 0; i < cities.length; i++) {
		if (i == 0) {
			text += '<div class="city active">' + cities[i] + "</div>";
			updateCityWeather(cities[i]);
			update5DayWeather(cities[i]);
			updateHourlyWeather(cities[i]);
			continue;
		}
		text += '<div class="city">' + cities[i] + "</div>";
	}
	document.getElementById("city-list").innerHTML = text;
	addEventListenerToCities();
}

function addEventListenerToCities() {
	var parent = document.getElementById("city-list");
	parent.addEventListener('click', function (event) {
		if (event.target.classList.contains("city")) {
			[].forEach.call(document.querySelectorAll('.city.active'), function (div) {
			  div.classList.remove("active");
			});
			event.target.classList.add("active");
			updateCityWeather(event.target.innerHTML);
			update5DayWeather(event.target.innerHTML);
			updateHourlyWeather(event.target.innerHTML);
		}
	}, false);
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    xhr = null;

  }
  return xhr;
}

function buildUrlForCurrentCity(city) {
	return "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",ge&units=metric&appid=327f0c4e1cfb6ac8bf357744e83629d7"
}

function buildUrlFor5DayCurrentCity(city) {
	return "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + ",ge&units=metric&appid=327f0c4e1cfb6ac8bf357744e83629d7"
}

function buildUrlForHourlyCurrentCity(city) {
	return "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",ge&units=metric&appid=327f0c4e1cfb6ac8bf357744e83629d7"
}

function updateCityWeather(city) {
	var xhr = createCORSRequest('GET', buildUrlForCurrentCity(city));
    
	if (!xhr) {
      throw new Error('CORS not supported');
    }

    xhr.onload = function() {
		var weatherObj = JSON.parse(xhr.responseText);
		document.getElementById("curr-city").innerHTML = weatherObj.name;
		document.getElementById("main-temp").innerHTML = parseInt(weatherObj.main.temp);
		document.getElementById("feels-temp").innerHTML = weatherObj.main.temp;
		document.getElementById("main-temp_max").innerHTML = parseInt(weatherObj.main.temp_max);
		document.getElementById("main-temp_min").innerHTML = parseInt(weatherObj.main.temp_min);
		document.getElementById("weather-main").innerHTML = weatherObj.weather[0].main + ', ' + weatherObj.weather[0].description;
		document.getElementById("big-animation").innerHTML = bigAnimations[weatherObj.weather[0].icon];
		document.getElementById("wind-deg").innerHTML = weatherObj.wind.deg;
		document.getElementById("wind-speed").innerHTML = weatherObj.wind.speed;
		setSunPhase(weatherObj.sys.sunrise * 1000, weatherObj.sys.sunset * 1000);
		setHumidityLevel(weatherObj.main.humidity);
		
	};

	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};

	xhr.send();
}

function updateHourlyWeather(city) {
	var xhr = createCORSRequest('GET', buildUrlForHourlyCurrentCity(city));
    
	if (!xhr) {
      throw new Error('CORS not supported');
    }

    xhr.onload = function() {
		var weatherObj = JSON.parse(xhr.responseText);
		var data = "";
		for (var i = 0; i < weatherObj.list.length; i++) {
			data += '<div class="column" title="' + weatherObj.list[i].dt_txt + '">' + 
						'<div>' + weatherObj.list[i].dt_txt.split(' ')[1].substr(0, 5) + '</div>' + 
						'<img src="icons/' + weatherObj.list[i].weather[0].icon + '.svg">' +
						'<div>' + parseInt(weatherObj.list[i].main.temp) + '&#176;</div>' + 
					'</div>'
		}
		document.getElementById("current-hourly-forecast").innerHTML = data;
	};

	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};

	xhr.send();
}

function update5DayWeather(city) {
	var xhr = createCORSRequest('GET', buildUrlFor5DayCurrentCity(city));
    
	if (!xhr) {
      throw new Error('CORS not supported');
    }

    xhr.onload = function() {
		var weatherObj = JSON.parse(xhr.responseText);
		var data = "";
		var currDate = new Date();
		for (var i = 0; i < weatherObj.list.length; i++) {
			currDate.setDate(currDate.getDate() +  1);
			data += '<div class="row">' + 
						'<div>' + (monthNames[currDate.getMonth()] + ', ' + currDate.getDate()) + '</div>' + 
						'<img src="icons/' + weatherObj.list[i].weather[0].icon + '.svg">' +
						'<div>' + parseInt(weatherObj.list[i].temp.max) + '&#176; / ' + parseInt(weatherObj.list[i].temp.min) + '&#176;</div>' + 
					'</div>'
		}
		document.getElementById("five-day-forecast").innerHTML = data;
	};

	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};

	xhr.send();
}

function setSunPhase(sunrise, sunset) {
	var sunriseTime = new Date(sunrise);
	var sunsetTime = new Date(sunset);
	var currTime = new Date();
	document.getElementById("sunrise").innerHTML = sunriseTime.getHours() + ":" + sunriseTime.getMinutes();
	document.getElementById("sunset").innerHTML = sunsetTime.getHours() + ":" + sunsetTime.getMinutes();
	var rotation = (currTime.getHours() - sunriseTime.getHours()) / (sunsetTime.getHours() - sunriseTime.getHours());
	var allDeg = 162;
	document.getElementById("rotation").style.transform = 'rotate(' + ((allDeg * rotation) - 44) + 'deg)';
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const cities = ['Tbilisi',
				'Marneuli',
				'Telavi',
				'Gurjaani',
				'Zhinvali',
				'Gori',
				'Akhalkalaki',
				'Tskhinvali',
				'Akhaltsikhe',
				'Zestaponi',
				'Kutaisi',
				'Oni',
				'Lentekhi',
				'Dioknisi',
				'Batumi',
				'Zugdidi',
				'Sokhumi'
				];
				
const bigAnimations = {
	'02d': '<div id="02d" class="icon sun-shower"><div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div></div>',
	'11d': '<div id="11d" class="icon thunder-storm"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>',
	'11n': '<div id="11n" class="icon thunder-storm"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div><div id="03d" class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>',
	'03n': '<div id="03n" class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>',
	'04d': '<div id="04d" class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>',
	'04n': '<div id="04n" class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>',
	'02n': '<div id="02n" class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>',
	'13d': '<div id="13d" class="icon flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>',
	'13n': '<div id="13n" class="icon flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>',
	'01d': '<div id="01d" class="icon sunny"><div class="sun"><div class="rays"></div></div></div>',
	'01n': '<div id="01n" class="icon sunny"><div class="sun"></div></div>',
	'10d': '<div id="10d" class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>',
	'10n': '<div id="10n" class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>'
};