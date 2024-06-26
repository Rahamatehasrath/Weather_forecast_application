const temp = document.getElementById("temp"),
  date = document.getElementById("date-time"),
  currentLocation = document.getElementById("location"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIcon = document.getElementById("icon"),
  uvIndex = document.querySelector(".uv-index"),
  uvText = document.querySelector(".uv-text"),
  windSpeed = document.querySelector(".wind-speed"),
  sunRise = document.querySelector(".sun-rise"),
  sunSet = document.querySelector(".sun-set"),
  humidity = document.querySelector(".humidity"),
  visibility = document.querySelector(".visibility"),
  humidityStatus = document.querySelector(".humidity-status"),
  airQuality = document.querySelector(".air-quality"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibility-status"),
  weatherCards = document.querySelector("#weather-cards"),
  celciusBtn = document.querySelector(".celcius"),
  fahrenheitBtn = document.querySelector(".fahrenheit"),
  hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  searchForm = document.querySelector("#search"),
  search = document.querySelector("#query");


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";


// function to get date and time
function getDateTime() {
    let now = new Date(),
      hour = now.getHours(),
      minute = now.getMinutes();
  
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    // 12 hours format
    hour = hour % 12;
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}
  
//Updating date and time
date.innerText = getDateTime();
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

// function to get public ip address
function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
      method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        currentCity = data.city;
        getWeatherData(data.city, currentUnit, hourlyorWeek)
    });
}
getPublicIp();

// function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
    const apiKey="MWPUNU52NX9U3GFXF9QFSW768";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        let today = data.currentConditions;
        if (unit === "c") {
            temp.innerText = today.temp;
        } else {
            temp.innerText = celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText = data.resolvedAddress;
        condition.innerText = today.conditions;
        rain.innerText = "Perc - " + today.precip + "%";
        uvIndex.innerText = today.uvindex;
        measureUvIndex(today.uvindex);
        windSpeed.innerText = today.windspeed;
        humidity.innerText = today.humidity + "%";
        updateHumidityStatus(today.humidity);
        visibility.innerText = today.visibility;
        updateVisibiltyStatus(today.visibility);
        airQuality.innerText = today.winddir;
        updateAirQualityStatus(today.winddir);
        sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
        sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
        mainIcon.src = getIcon(today.icon);
        changeBackground(today.icon);
        if (hourlyorWeek === "hourly") {
          updateForecast(data.days[0].hours, unit, "day");
        } else {
          updateForecast(data.days, unit, "week");
        }
    })
    .catch((err) => {
      alert("City not found in our database");
    });
}

// function to conver celcius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureUvIndex(uvIndex){
    if (uvIndex <= 2) {
        uvText.innerText = "Low";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}

// function to get humidity status
function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
      humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
      humidityStatus.innerText = "Moderate";
    } else {
      humidityStatus.innerText = "High";
    }
}

// function to get visibility status
function updateVisibiltyStatus(visibility) {
    if (visibility <= 0.03) {
      visibilityStatus.innerText = "Dense Fog";
    } else if (visibility <= 0.16) {
      visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 0.35) {
      visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 1.13) {
      visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.16) {
      visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
      visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility <= 10.8) {
      visibilityStatus.innerText = "Clear Air";
    } else {
      visibilityStatus.innerText = "Very Clear Air";
    }
}

// function to get air quality status
function updateAirQualityStatus(airquality) {
    if (airquality <= 50) {
      airQualityStatus.innerText = "Good👌";
    } else if (airquality <= 100) {
      airQualityStatus.innerText = "Moderate😐";
    } else if (airquality <= 150) {
      airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
    } else if (airquality <= 200) {
      airQualityStatus.innerText = "Unhealthy😷";
    } else if (airquality <= 250) {
      airQualityStatus.innerText = "Very Unhealthy😨";
    } else {
      airQualityStatus.innerText = "Hazardous😱";
    }
}

// convert time to 12 hour format
function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = hour < 10 ? "0" + hour : hour;//add prefix 0 if less than 10
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

// function to change weather icons
function getIcon(condition) {
  if (condition === "partly-cloudy-day") {
    return "https://wikiclipart.com/wp-content/uploads/2017/02/Partly-cloudy-with-sunshine-clip-art-at-vector-clip.png";
  } else if (condition === "partly-cloudy-night") {
    return "https://webstockreview.net/images/cloudy-clipart-cloudy-moon-5.png";
  } else if (condition === "rain") {
    return "http://www.clipartbest.com/cliparts/pc5/ozk/pc5ozkycB.png";
  } else if (condition === "clear-day") {
    return "http://cliparts.co/cliparts/di9/rkA/di9rkA7xT.png";
  } else if (condition === "clear-night") {
    return "http://www.clipartbest.com/cliparts/aTe/Xg4/aTeXg4djc.png";
  } else {
    return "http://cliparts.co/cliparts/di9/rkA/di9rkA7xT.png";
  }
}

//get hours from hh:mm:ss
function getHour(time) {
  let hour = time.split(":")[0];
  let min = time.split(":")[1];
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
}

// function to get day name from date
function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}


//function to update Forecast
function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = 0;
  if (type === "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = getHour(data[day].datetime);
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    }
    let dayTemp = data[day].temp;
    if (unit === "f") {
      dayTemp = celciusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    if (unit === "f") {
      tempUnit = "°F";
    }
    card.innerHTML = `
        <h2 class="day-name">"${dayName}"</h2>
        <div class="card-icon">
            <img src="${iconSrc}" style="height: 50px; width: 50px;" class="day-icon" alt="" />
        </div>
        <div class="day-temp">
            <h2 class="temp">${dayTemp}</h2>
            <span class="temp-unit">${tempUnit}</span>
        </div>
        </div>
    `;
    weatherCards.appendChild(card);
    day++;
  }
}

fahrenheitBtn.addEventListener("click", () => {
  changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("c");
});

// function to change unit
function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    //change unit on document
    tempUnit.forEach((elem) => {
      elem.innerText = `°${unit.toUpperCase()}`;
    });
    if (unit === "c") {
      celciusBtn.classList.add("active");
      fahrenheitBtn.classList.remove("active");
    } else {
      celciusBtn.classList.remove("active");
      fahrenheitBtn.classList.add("active");
    }
    //call get weather after change unit
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

// function to change hourly to weekly or vice versa
function changeTimeSpan(unit) {
  if (hourlyorWeek !== unit) {
    hourlyorWeek = unit;
    if (unit === "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    //update weather on time change
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

// function to change background depending on weather conditions
function changeBackground(condition) {
  const body = document.querySelector("body");
  let bg = "";
  if (condition === "partly-cloudy-day") {
    bg = "https://i.pinimg.com/originals/68/d3/02/68d3025963e4a3186f4ed150f019298b.jpg";
  } else if (condition === "partly-cloudy-night") {
    bg = "https://wallpaperaccess.com/full/2366439.jpg";
  } else if (condition === "rain") {
    bg = "http://2.bp.blogspot.com/-5L4BzrLVowM/UADBzeY4BlI/AAAAAAAAF1o/dsmdhEFqubk/s1600/rain-wallpaper.jpg";
  } else if (condition === "clear-day") {
    bg = "https://pluspng.com/img-png/sunny-sky-png-sunny-blue-sky-2048.png";
  } else if (condition === "clear-night") {
    bg = "https://wallpapercave.com/wp/wp5215332.jpg";
  } else {
    bg = "https://i.pinimg.com/originals/68/d3/02/68d3025963e4a3186f4ed150f019298b.jpg";
  }
  body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${bg})`;
}

// function to handle search form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    currentCity = location;
    getWeatherData(location, currentUnit, hourlyorWeek);
  }
});

//lets create city array we want to suggest or we can use any api for this
cities=[
  "jungle",
  "hy",
  "hyd",
  "hyde",
  "hyder",
  "hydera",
  "hyderab",
  "hyderaba",
  "hyderabad",
]
//import cities from "./cities.js";
var currentFocus;
search.addEventListener("input", function (e) {
  removeSuggestions();
  var a,
    b,
    i,
    val = this.value;
    //if there is nothing search do nothing
  if (!val) {
    return false;
  }
  currentFocus = -1;
  
  //creating a ul with id suggestions
  a = document.createElement("ul");
  a.setAttribute("id", "suggestions");

  //append the ul to its parent which is search form
  this.parentNode.appendChild(a);

  //adding li's with matching search suggestions

  for (i = 0; i < cities.length; i++) {
    /*check if the item starts with the same letter wich are in input:*/
    if (cities[i].substr(0, val.length).toUpperCase() == val.toUpperCase
    ()) {
      //if any suggestion matching then create li
      /*create a li element for each matching element:*/
      b = document.createElement("li");
      //adding content in li
      /*strong is to make the matching letters bold:*/
      b.innerHTML ="<strong>" + cities[i].substr(0, val.length) + "</strong>";
      //remaining part of suggestion
      b.innerHTML += cities[i].substr(val.length);
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", function (e) {
        /*insert the value for the autocomplete text field:*/
        search.value = this.getElementsByTagName("input")[0].value;
        removeSuggestions();
      });
      //append suggeste li to ul
      a.appendChild(b);
    }
  }
});

//now its working but every new suggestion is coming over prev 
//lets remove prev and add new ones

function removeSuggestions() {
  //select the ul which is being adding on the serach input
  var x = document.getElementById("suggestions");
  //if x exists remove it
  if (x) x.parentNode.removeChild(x);
}

//lets add up and down keys functionality to select a suggestion

/*execute a function presses a key on the keyboard:*/
search.addEventListener("keydown", function (e) {
  var x = document.getElementById("suggestions");
  //select the li element of suggention ul
  if (x) x = x.getElementsByTagName("li");
  if (e.keyCode == 40) {
    /*If the arrow DOWN key is pressed,increase the currentFocus variable: i.e if key code is down button*/
    currentFocus++;
    /*and  make the current item more visible:*/
    //lets create function to add active suggestion 
    addActive(x);
  } else if (e.keyCode == 38) {
    /*If the arrow UP key
      is pressed,
      decrease the currentFocus variable:i.e if key code is up button*/
    currentFocus--;
    /*and  make the current item more visible:*/
    addActive(x);
  }
  if (e.keyCode == 13) {
    /*If the ENTER key is pressed, prevent the form from being submitted,*/
    //if enter is pressed add the current select suggestion in input field 
    e.preventDefault();
    if (currentFocus > -1) {
      /*and simulate a click on the "active" item:*/
      //if any suggestion is selected click it
      if (x) x[currentFocus].click();
    }
  }
});

function addActive(x) {
  //if there is no suggestion return as it is
  if (!x) return false;
  /*start by removing the "active" class on all items:*/
  removeActive(x);
  //if current focus is more than the length of suggestion array make it 0
  if (currentFocus >= x.length) currentFocus = 0;
  //if its less than 0 make its last suggestions equals
  if (currentFocus < 0) currentFocus = x.length - 1;
  /*add class "autocomplete-active":i.e. adding active class on focused li*/
  x[currentFocus].classList.add("active");
}

//its working but we need to remove previously activated suggestions

function removeActive(x) {
  /*a function to remove the "active" class from all autocomplete items:*/
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
  }
}