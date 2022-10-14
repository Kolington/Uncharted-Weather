const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoText = inputPart.querySelector(".info-text");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const wIcon = document.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");

let api;
let apiKey;

inputField.addEventListener("keyup", e => {
    // if user pressed the enter button and input value is not empty
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) { //if browser support geolocation
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your Browser not support geolocation api");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords; //Getting lat and lon of the user devices from coords obj
    apiKey = "847abcbde7c90c54740814d4e5120fa1";
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoText.innerText = error.message;
    infoText.classList.add("error");
}

function requestApi(city) {
    apiKey = "847abcbde7c90c54740814d4e5120fa1";
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoText.innerText = "Getting Weather Details....";
    infoText.classList.add("pending");
    //getting api resource and returning it with with parsing into js obj and in another
    //then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    infoText.classList.replace("pending", "error");
    if (info.cod == "404") {
        infoText.innerText = `${inputField.value} isn't a vaild city name`;
    } else {
        // let's get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        // using custom icon according to the id which api return us
        if (id == 800) {
            wIcon.src = "./images/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "./images/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "./images/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "./images/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "./images/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "./images/rain.svg";
        }

        //let's pass these values to a particular html elements
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoText.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});