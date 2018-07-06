document.onreadystatechange = () => {
	if (document.readyState === 'complete') {
	
		initializeList();
		setHumidityLevel(78);
	
	}
};

function setHumidityLevel(perc) {
	let deg = (perc * 280) / 100
	var activeBorder = document.getElementById("activeBorder");
	
    if (deg<=140){
        activeBorder.style.backgroundImage ='linear-gradient(' + (90+deg) + 'deg, transparent 50%, #A2ECFB 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)';
    }
    else{
        activeBorder.style.backgroundImage = 'linear-gradient(' + (deg-90) + 'deg, transparent 50%, #39B4CC 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)';
    }
	
	document.getElementById("perc").innerHTML = Math.round(perc)+"%";
}

function initializeList() {
	var text = "";
	for (var i = 0; i < cities.length; i++) {
		if (i == 0) {
			text += '<div class="city active">' + cities[i] + "</div>";
			updateCityWeather(cities[i]);
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
		}
	}, false);
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function buildUrlForCurrentCity(city) {
	return "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",ge&units=metric&appid=327f0c4e1cfb6ac8bf357744e83629d7"
}

function updateCityWeather(city) {
	var xhr = createCORSRequest('GET', buildUrlForCurrentCity(city));
    
	if (!xhr) {
      throw new Error('CORS not supported');
    }

    xhr.onload = function() {
		var text = xhr.responseText;
		console.log(text);
	};

	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};

	xhr.send();
}

var cities = ['Tbilisi',
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