require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
const ejs = require('ejs');
// const fs = require('fs');

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var city = "Mumbai";

// const data = fs.readFileSync("data.json");
// console.log(data);
// const jsonData = JSON.parse(data);
// const apiKey = jsonData.apiKey;
// console.log(apiKey);


app.get('/', function(req, res) {

    const city = "Mumbai";
    const apiKey = process.env.API_KEY;
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey;

    https.get(url, function (response) {
        // console.log(response.statusCode);

        response.on("data", function (data) {
            // console.log(data);
            const weatherData = JSON.parse(data)
            // console.log(weatherData);

            const location = weatherData.name + ", " + weatherData.sys.country;
            const date = currentDate();
            const temp = weatherData.main.temp;
            const tempMin = weatherData.main.temp_min;
            const tempMax = weatherData.main.temp_max;
            const tempMinMax = tempMin + "°C / " + tempMax + "°C";
            const description = weatherData.weather[0].main;

            // display(location, date, temp, tempMin, tempMax, description);
            res.render("index", { location: location, date: date, temp: temp, tempMinMax: tempMinMax, description: description })
        });

    });

    // res.render("index", { location: "location", date: "date", temp: "temp", tempMinMax: "tempMinMax", description: "description" })
});

app.post('/', function(req, res) {
    // console.log(req.body.city);
    const city = req.body.city;
    const apiKey = process.env.API_KEY;
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey;

    https.get(url, function(response) {
        // console.log(response.statusCode);

        response.on("data", function(data) {
            // console.log(data);
            const weatherData = JSON.parse(data)
            // console.log(weatherData);

            const location = weatherData.name + ", " + weatherData.sys.country;
            const date = currentDate();
            const temp = weatherData.main.temp;
            const tempMin = weatherData.main.temp_min;
            const tempMax = weatherData.main.temp_max;
            const tempMinMax = tempMin + "°C / " + tempMax + "°C"; 
            const description = weatherData.weather[0].main;

            // display(location, date, temp, tempMin, tempMax, description);
            res.render("index", { location: location, date: date, temp: temp, tempMinMax: tempMinMax, description: description })
        });

    });

});

function currentDate() {
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today = new Date();
    return today.toLocaleDateString("en-US", options);
}

// function display(location, date, temp, tempMin, tempMax, description) {
//     console.log(locationText);
// }

app.listen(3000, function(){
    console.log('Server started on port 3000...');
});




