/* Global Variables */
const url = 'https://api.openweathermap.org/data/2.5/weather?zip='
const api = '&appid=02426d48ecc066be685dbcf67178a0b9&units=metric'
const server = 'http://127.0.0.1:3030'

const date = document.getElementById('date')
const head = document.querySelector('.head')
const city = document.querySelector('.city')
const temp = document.getElementById('temp')
const content = document.getElementById('content')
const feelings = document.getElementById('feelings')

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

// populating the date on the UI
document.getElementById('date').innerHTML = newDate;

/* Function called by event listener */
const generateWeather = () => {
    const zip = document.getElementById('zip').value;
    const feeling  = document.getElementById('feelings').value;
    
    /* Function to GET Web API Data*/
    const callApi = async (zip) => {

        try {
            let weather = await fetch (url + zip + api)
            let weatherJson = await weather.json()

            return weatherJson

        } catch (error) {
            console.log(error);
        }
    }

    /* Function to set up the data object*/
    const destructure = (weatherJson) => {

        const temp = weatherJson.main.temp;
        const city = weatherJson.name;
        const description = weatherJson.weather.description;
        const country = weatherJson.sys.country;

        const projectNewData = {
            temp: temp,
            city: city,
            description: description,
            country: country,
            date: newDate,
            feeling: feeling
        }

        console.log(projectNewData);
        postData(server + '/add', projectNewData)
        return projectNewData
    }

    /* Function to POST data */
    const postData = async (url = '', projectNewData = {}) => {
        const response = await fetch (url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            credentials: 'same-origin', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectNewData),
        });

        try {
            const responseJson = await response.json()

            console.log(`You just posted ${responseJson}`);
            getData(responseJson)
            return responseJson;

        } catch (error) {
            console.log(error);
        }
    }

    /* Function to populate UI with Project Data */
    const getData = async (responseJson) => {

        try {
            date.innerHTML = responseJson.date;
            head.innerHTML = responseJson.country;
            city.innerHTML = responseJson.city;
            temp.innerHTML = responseJson.temp;
            content.innerHTML = responseJson.description;
            feelings.innerHTML = responseJson.feeling;

        } catch (error) {
            console.log(error);
        }
    }

    /* calling the declared functions*/
    callApi(zip)
    .then((weatherJson) => {
        destructure(weatherJson)
    })
    
    
}

// Event listener to add function to existing HTML DOM element
const btn = document.getElementById('generate');

btn.addEventListener('click', generateWeather)
