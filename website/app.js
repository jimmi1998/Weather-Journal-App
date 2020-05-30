'use strict';
/**
 * Define Global Variables
 * 
*/
const apiKey = '48d4a2f418735d78b37352b3e984fb02';
const baseURLZip = 'http://api.openweathermap.org/data/2.5/weather?id=';
const baseURLCity = 'http://api.openweathermap.org/data/2.5/weather?q=';


const zip = document.getElementById('zip');
const city = document.getElementById('city');
const feelings = document.getElementById('feelings');

const entriesList = document.getElementById('entriesList');
const countList = document.getElementById('count-list');

const entryDate = document.getElementById('date');
const entryContent = document.getElementById('content');
const entryTemp = document.getElementById('temp');

const emptyEntry = document.querySelector('.entry-empty');
const emptyOneEntry = document.querySelector('.entry-one-empty');
const lastEntry = document.querySelector('.last-entry');

const errorZip = document.querySelector('.error-zip');
const errorCity = document.querySelector('.error-city');
const errorFeelings = document.querySelector('.error-feelings');

const holderCode = document.querySelector('.holder.codes');
const holderCity = document.querySelector('.holder.city');
const holderZip = document.querySelector('.holder.zip');
const toggleCode = document.querySelector('.toggle-code');
const toggleCity = document.querySelector('.toggle-city');
let currentField = 'zip';

const codeNum = document.querySelectorAll('.code');
let isToggleCode = true;

const modalWindow = document.querySelector('.modal');
const modalCurtain = document.querySelector('.modal-curtain');
const modalBtnDelete = document.querySelector('.btn-delete');
const modalBtnClose = document.querySelector('.btn-cancel');
let isModal = false;
let isDeleteId = 0;

const localData = JSON.parse(localStorage.getItem('weather'));
let dataEntries = [];

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

/**
* @description Reate a new date instance dynamically with JS.
*/
let timeData = new Date();
let date = timeData.getMonth() + '.' + timeData.getDate() + '.' + timeData.getFullYear();
let time = timeData.getHours() + ':' + timeData.getMinutes();

/**
* @description Helper for create new html element.
* @param {string} tag - the name of the tag of the new element.
* @param {string} className - the class name of the new element (optional).
* @returns {Node} - new HTML element
*/
const createNewElement = (tag, className = '') => {
    let newElement = document.createElement(tag);
    className !== '' ? newElement.classList.add(className) : null;
    return newElement;
};

/**
* @description Helper for сonverts degrees from Kelvins to Celsius.
* @param {number} deg - degree in Kelvin.
* @returns {number} - degree in Celsius.
*/
const kelvinToCelsius = deg => (deg - 273.15).toFixed(1);

/**
* @description Helper for сonverts degrees from Kelvins to Fahrenheit.
* @param {number} deg - degree in Kelvin.
* @returns {number} - degree in Fahrenheit.
*/
const kelvinToFahrenheit = deg => ((deg - 273.15) * 1.8000 + 32.00).toFixed(1);

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

/**
* @description Function for getting project data from the server or localStorage.
*/
const getProjectData = async () => {
    const res = await fetch('/get');

    if (dataEntries.length === 0 && localData !== null) {
        dataEntries = localData.reverse();
        // Adding all elements to the page.
        dataEntries.forEach(entry => {
            generateEntry(entry);
            generateOneEntry(entry);
        });
        setProjectData('/set', dataEntries.reverse());
    } else {
        try {
            dataEntries = await res.json();
            // Adding all elements to the page.
            dataEntries.reverse().forEach(entry => {
                generateEntry(entry);
                generateOneEntry(entry);
            });
        } catch (error) {
            console.log('error', error);
        }
    }
    toggleOneEmptyEntry();
    toggleEmptyEntry();
    counterEntriesList();
    allCodeExample();
};

/**
* @description Function for sending data to the server.
* @param {string} url - link for the server router.
* @param {object} data - data to send to the server.
* @returns {array} - array of objects to store on the server.
*/
const setProjectData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log('error', error);
    }
};

/**
* @description Function POST Project Data.
* @param {string} baseURL - link to the Web API server.
* @param {string} zip - zip code of the city.
* @param {string} key - API secret key.
* @returns {object} - object with data from the API server.
*/
const getCurrentWeather = async (baseURL, zip, key) => {
    const res = await fetch(baseURL + zip + '&appid=' + key);
    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

/**
* @description Function for creating a new entry element on the page.
* @param {object} entry - object with data for creating a entry.
*/
const generateOneEntry = (entry) => {
    entryDate.innerHTML = '';
    entryContent.innerHTML = '';
    entryTemp.innerHTML = '';

    let tempCelsius = kelvinToCelsius(entry.data.main.temp);
    let tempFahrenheit = kelvinToFahrenheit(entry.data.main.temp);

    let entryTempElement = `
        <div class="item-city">
            <span class="city">${entry.data.name}, ${entry.data.sys.country}</span> |
            <span class="temperature">${tempFahrenheit}</span> °F /${' '}
            <span class="temperature">${tempCelsius}</span> °C<br>
            <span class="zip">zip: ${entry.zip}</span><br>
        </div>
        <div class="weather">Weather:
            <span class="item-value"> ${entry.data.weather[0].main}, ${entry.data.weather[0].description}</span>
        </div>
        <div class="wind">Wind:
            <span class="item-value"> ${entry.data.wind.speed} m/s, (${entry.data.wind.deg})</span>
        </div>
        <div class="pressure">Pressure:
            <span class="item-value"> ${entry.data.main.pressure} hpa</span>
        </div>
        <div class="humidity">Humidity:
            <span class="item-value"> ${entry.data.main.humidity} %</span>
        </div>
    `;
    entryDate.innerHTML = entry.date;
    entryContent.innerHTML = entry.feelings;
    entryTemp.innerHTML = entryTempElement;
};

/**
* @description Function for creating a new entry element for list entries on the page.
* @param {object} entry - object with data for creating a entry.
*/
const generateEntry = (entry) => {
    let itemEntry = createNewElement('section', 'item-entry');
    let tempCelsius = kelvinToCelsius(entry.data.main.temp);
    let tempFahrenheit = kelvinToFahrenheit(entry.data.main.temp);

    let entryElements = `
        <div class="item-info">
            <div class="item-date-del">
                <div class="item-date">${entry.date}</div>
                <span id="btn_${entry.id}" class='delete-entry'>delete entry</span>
            </div> 
            <p class="item-feeling">${entry.feelings}</p>
        </div>
        <div class="item-weather">
            <div class="item-city">
                <span class="city">${entry.data.name}, ${entry.data.sys.country}</span> |
                <span class="temperature">${tempFahrenheit}</span> °F /${' '}
                <span class="temperature">${tempCelsius}</span> °C<br>
                <span class="zip">zip: ${entry.zip}</span><br>
            </div>
            <div class="weather">Weather:
                <span class="item-value"> ${entry.data.weather[0].main}, ${entry.data.weather[0].description}</span>
            </div>
            <div class="wind">Wind:
                <span class="item-value"> ${entry.data.wind.speed} m/s, (${entry.data.wind.deg})</span>
            </div>
            <div class="pressure">Pressure:
                <span class="item-value"> ${entry.data.main.pressure} hpa</span>
            </div>
            <div class="humidity">Humidity:
                <span class="item-value"> ${entry.data.main.humidity} %</span>
            </div>
        </div>
    `;
    itemEntry.id = `entry_${entry.id}`;
    itemEntry.innerHTML = entryElements;
    addDelete(itemEntry);
    entriesList.prepend(itemEntry);
};

/**
* @description To hide or display the information bar about the availability of the entries.
*/
const toggleEmptyEntry = () => {
    if (dataEntries.length === 0) {
        emptyEntry.style.display = 'block';
    } else {
        emptyEntry.style.display = 'none';
    }
};

/**
* @description To hide or display the information bar about the availability of the entry.
*/
const toggleOneEmptyEntry = () => {
    if (dataEntries.length === 0) {
        emptyOneEntry.style.display = 'block';
        lastEntry.style.display = 'none';
    } else {
        emptyOneEntry.style.display = 'none';
        lastEntry.style.display = 'flex';
    }
};

/**
* @description Checking that the text input fields are filled in correctly.
* @param {string} valueZip - Zip input field value.
* @param {string} valueFeelings -  Feelings input field value.
* @param {object} dataWeather - Object containing weather data.
* @returns {boolean} - Return true or folse if the fields are filled in correctly.
*/
const errorFields = (valueZipCity, valueFeelings, dataWeather) => {

    if (valueZipCity === '' && valueFeelings === '') {
        errorFeelings.style.display = 'block';
        currentField === 'zip' ?
            errorZip.style.display = 'block' :
            errorCity.style.display = 'block';
        return false;
    }

    if (valueZipCity === '' || dataWeather.cod === '404') {
        currentField === 'zip' ?
            errorZip.style.display = 'block' :
            errorCity.style.display = 'block';
        return false;
    }

    if (valueFeelings === '') {
        errorFeelings.style.display = 'block';
        return false;
    }
    return true;
};

/**
* @description Function to delete the selected entry.
* @param {number} id - id deleted entry.
*/
const deleteEntry = (id) => {

    // Select the entry to be deleted and delete it.
    let entry = document.getElementById(`entry_${id}`);
    entry.parentNode.removeChild(entry);

    // Delete data entry from dataEntries.
    dataEntries = dataEntries.filter(item => {
        return item.id !== +id;
    });

    // Updating data on the server.
    setProjectData('/update', dataEntries.reverse());

    // Сlear localStorage and add new data.
    localStorage.setItem('weather', JSON.stringify([]));
    localStorage.setItem('weather', JSON.stringify(dataEntries.reverse()));

    // Check if a stub is needed for entries.
    toggleEmptyEntry();
    toggleOneEmptyEntry();

    // Checking the number of entries.
    counterEntriesList();

    // Closing the modal window.
    modalWindow.classList.remove('active');
    isModal = false;
};

/**
* @description Function for counting the number of entries.
*/
const counterEntriesList = () => {
    if (dataEntries.length === 0) {
        countList.innerText = 0;
    } else {
        countList.innerText = dataEntries.length;
    }
};

/**
 * End Main Functions
 * Begin Event listener
 * 
*/

/**
* @description Function called by event listener.
*/
const newEntry = async () => {

    let value = currentField === 'zip' ? zip.value.split(' ').join('') : city.value;
    let currentURL = currentField === 'zip' ? baseURLZip : baseURLCity;
    let valueFeelings = feelings.value;

    let timeInMs = Date.now();

    let data = await getCurrentWeather(currentURL, value, apiKey);
    let newData = { id: timeInMs, date: `${time} | ${date}`, zip: value, feelings: valueFeelings, data };

    let isError = errorFields(value, valueFeelings, data);

    if (isError) {

        // Adding new data to list entries on the page.
        generateEntry(newData);

        // Adding new data to new entry on the page.
        generateOneEntry(newData);

        // Adding new data a global variable.
        dataEntries.unshift(newData);

        // Check if a stub is needed for entries.
        toggleOneEmptyEntry();
        toggleEmptyEntry();

        // Checking the number of entries.
        counterEntriesList();

        // Sending updated data to the server.
        setProjectData('/set', dataEntries);

        // Adding new data to LocalStorage.
        localStorage.setItem('weather', JSON.stringify(dataEntries));

        // Clearing the input fields.
        zip.value = null;
        city.value = null;
        feelings.value = null;
    }
};

/**
* @description Event listener for the button, click add new elements to the page.
*/
document.getElementById('generate').addEventListener('click', newEntry);

/**
* @description Event listener for zip city codes.
*/
toggleCode.addEventListener('click', () => {
    if (isToggleCode) {
        toggleCode.innerText = 'hide';
        holderCode.classList.add('active');
        isToggleCode = false;
    } else {
        toggleCode.innerText = 'code examples';
        holderCode.classList.remove('active');
        isToggleCode = true;
    }
});

/**
* @description Event listener for switching input fields of code and city name.
*/
toggleCity.addEventListener('click', () => {
    if (currentField === 'city') {
        zip.value = '';
        toggleCode.style.display = 'block';
        toggleCity.innerText = 'enter name';
        holderCity.classList.remove('active');
        holderZip.classList.add('active');
        currentField = 'zip';
    } else {
        city.value = '';
        toggleCode.style.display = 'none';
        toggleCity.innerText = 'enter zip';
        holderCity.classList.add('active');
        toggleCode.innerText = 'code examples';
        holderCode.classList.remove('active');
        holderZip.classList.remove('active');
        currentField = 'city';
    }
});

/**
* @description Event listener for buttons - zip city codes.
*/
const allCodeExample = () => {
    codeNum.forEach(item => {
        item.addEventListener('click', (e) => {
            zip.value = '';
            zip.value = e.target.textContent;
        });
    });
};

/**
* @description Add Event listener for delete button for entry.
* @param {Node} newData - new entry Node element.
*/
const addDelete = (newData) => {
    let deleteButton = newData.querySelector('.delete-entry');

    deleteButton.addEventListener('click', (e) => {
        isDeleteId = e.target.id;

        if (isModal) {
            modalWindow.classList.remove('active');
            isModal = false;
        } else {
            modalWindow.classList.add('active');
            isModal = true;
        }
    });
};

/**
* @description Add Event listeners onkeyup to input zip to enter numbers only.
*/
zip.addEventListener('keyup', () => {
    zip.value = zip.value.replace(/\D/g, '');
});

/**
* @description Add Event listeners for close Modal window.
*/
modalCurtain.addEventListener('click', () => {
    modalWindow.classList.remove('active');
    isModal = false;
});

modalBtnClose.addEventListener('click', () => {
    modalWindow.classList.remove('active');
    isModal = false;
});

/**
* @description Add Event listeners for delete entry.
*/
modalBtnDelete.addEventListener('click', () => {
    deleteEntry(isDeleteId.substr(4));
});

/**
* @description Event listener for zip input field error informer.
*/
errorZip.addEventListener('mouseover', () => {
    errorZip.style.display = 'none';
});

/**
* @description Event listener for zip input field error informer.
*/
errorCity.addEventListener('mouseover', () => {
    errorCity.style.display = 'none';
});


/**
* @description Event listener for feelings input field error informer.
*/
errorFeelings.addEventListener('mouseover', () => {
    errorFeelings.style.display = 'none';
});

/**
* @description Function for getting data in load page.
*/
window.onload = () => getProjectData();
