require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DEFAULT_CITY = 'Mumbai';

function currentDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

function emptyView(error) {
    return {
        location: '',
        date: currentDate(),
        temp: '',
        tempMinMax: '',
        description: '',
        icon: '',
        error: error || ''
    };
}

async function fetchWeather(city) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error('Missing API_KEY. Set it in your environment or .env file.');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Could not fetch weather for "${city}".`);
    }

    return {
        location: `${data.name}, ${data.sys.country}`,
        date: currentDate(),
        temp: Math.round(data.main.temp),
        tempMinMax: `${Math.round(data.main.temp_min)}°C / ${Math.round(data.main.temp_max)}°C`,
        description: data.weather[0].main,
        icon: data.weather[0].icon,
        error: ''
    };
}

async function renderWeather(req, res, city) {
    try {
        const view = await fetchWeather(city);
        res.render('index', view);
    } catch (err) {
        res.render('index', emptyView(err.message));
    }
}

app.get('/', (req, res) => {
    renderWeather(req, res, DEFAULT_CITY);
});

app.post('/', (req, res) => {
    const city = (req.body.city || '').trim() || DEFAULT_CITY;
    renderWeather(req, res, city);
});

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}...`);
    });
}

module.exports = app;
