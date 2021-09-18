/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

document.querySelector('.date').innerHTML = newDate;

//test
const url = 'https://api.openweathermap.org/data/2.5/weather?zip='
const api = '&appid=02426d48ecc066be685dbcf67178a0b9&units=metric'
const server = 'http://127.0.0.1:3030'

const error = document.querySelector('.error')

const generate = () => {
    const zip = document.getElementById('entry').value;
    const feeling = document.getElementById('feeling').value;

    getWeatherData(zip).then((data) => {
        if (data) {
            const {
                main: { temp },
                name: city,
                weather: [{ description }],
                sys: { country },

            } = data

            const info = {
                newDate,
                temp: Math.round(temp),
                description,
                city,
                feeling,
                country
            };

            postData(server + '/add', info);

            update();

        }
    })
}

document.getElementById('btn').addEventListener('click', generate);

const getWeatherData = async (zip) => {
    try {
        const res = await fetch(url+zip+api);
        const data = await res.json();

        if (data.cod != 200) {
            error.innerHTML = data.message;
            error.style.opacity = 1;
            setTimeout(_ => {
                error.innerHTML = ""
                error.style.opacity = 0
            }, 3000)
            throw `${data.message}`;
        }

        return data;
    } catch (error) {
        console.log(error);
    }
};

const postData = async (url = '', info = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
    });

    try {
        const newData = await res.json();
        console.log('you have just saved', newData);
        return newData;
    } catch (error) {
        console.log(error);
    }
};

const update = async () => {
    const res = await fetch(server + '/data');
    
    try {
        const savedData = await res.json();

        document.querySelector('.date').innerHTML = savedData.newDate;
        document.querySelector('.head').innerHTML = savedData.country;
        document.querySelector('.city').innerHTML = savedData.city;
        document.querySelector('.temp').innerHTML = savedData.temp + '&degC';
        document.querySelector('.desc').innerHTML = savedData.description;
        document.querySelector('#feeling').innerHTML = savedData.feeling;
    } catch (error) {
        console.log(error);
    }
}
