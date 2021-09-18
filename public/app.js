/* Global Variables */
const url = 'https://api.openweathermap.org/data/2.5/weather?zip='
const api = '&appid=02426d48ecc066be685dbcf67178a0b9&units=metric'
const server = 'http://127.0.0.1:3030'
const error = document.querySelector('.error')

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

// populating the date in it's location
document.querySelector('.date').innerHTML = newDate;

// function to run on button click to generate the needed data
const generate = () => {
    const zip = document.getElementById('entry').value;
    const feeling = document.getElementById('feeling').value;

    // these are for showing the boxes of info
    const head = document.querySelector('.head');
    const temprature = document.querySelector('.temprature');
    const disc = document.querySelector('.description');

    // function to destructure the response opject that we get after passing the zip code the the getWeatherData function
    getWeatherData(zip).then((data) => {
        if (data) {
            const {
                main: { temp },
                name: city,
                weather: [{ description }],
                sys: { country },

            } = data

            // here we prepare the opject to be saved on the local server
            const info = {
                newDate,
                temp: Math.round(temp),
                description,
                city,
                feeling,
                country
            };

            // calling the post function to save the new opject on the local server
            postData(server + '/add', info);

            // here we call the function that updates the UI for the user
            update();

            // showing the divs containing the conuntry, temprature and weather description
            head.classList.add('head-show');
            disc.classList.add('box-show');
            temprature.classList.add('box-show');
            
        }
    })
}

// added the event listener to the button to run the generate function
document.getElementById('btn').addEventListener('click', generate);

// creates the main function GET the date from the api
const getWeatherData = async (zip) => {
    try {
        const res = await fetch(url+zip+api);
        const data = await res.json();

        // making sure that the api responded with no error
        if (data.cod != 200) {

            //if there is an error we print it on the UI so the user can get an idea of the error happend
            error.innerHTML = data.message;
            error.style.opacity = 1;
            // the error is then removed from the UI
            setTimeout(_ => {
                error.innerHTML = ""
                error.style.opacity = 0
            }, 3000)

            // terminate the function if there is an error
            throw `${data.message}`;
        }

        // return data to be used .then to prepare the object to be stored on the local server
        return data;

    } catch (error) {
        console.log(error);
    }
};

// define the post function to send the final data that will be showen on the UI
const postData = async (url = '', info = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
    });

    // the newData is the full object that is on the local server
    try {
        const newData = await res.json();

        // we return the data here so we can use it in the next function to populate the UI
        return newData;

    } catch (error) {
        console.log(error);
    }
};

// function to update the UI with all the new object data
const update = async () => {

    //we fetch it from the local server
    const res = await fetch(server + '/data');
    
    try {
        const savedData = await res.json();

        // then we put each property in it's location on the UI
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
