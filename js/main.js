// // http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=civil&output=json

document.addEventListener("DOMContentLoaded", () => {
    const cityList = document.getElementById('list');
    var data; // Stores the list of {latitude, longitude, city, country}

    async function main() {
        try {
            let response = await fetch('city_data.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json(); // Parse the JSON data
            populateCityList(data); // Function to populate the city list in the DOM
        } catch (error) {
            console.error('Error fetching the file:', error);
        }
    }

    function populateCityList(cityData) {
        cityData.forEach(city => {
            const listItem = document.createElement('option');
            listItem.setAttribute('value', city.city);
            listItem.textContent = `${city.city}, ${city.country}`;
            cityList.appendChild(listItem);
        });
    }

    async function getAPI(api_string) {
        try {
            let response = await fetch(api_string);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json(); // Parse the JSON data
        } catch (error) {
            console.error('Error fetching the API:', error);
        }
    }

    cityList.addEventListener("change", () => {
        const loader = document.getElementById('loader');
        if(loader)
            {
                loader.classList.remove('hide');
                loader.classList.add('show');
            }

        let new_city_name = cityList.value;
        // Search for city_name in the data array
        const result = data.find(item => item.city === new_city_name);
        if (result) {
            (async () => {
                let api_string = `http://www.7timer.info/bin/api.pl?lon=${result.longitude}&lat=${result.latitude}&product=civil&output=json`;
                let api_data = await getAPI(api_string);
                if(loader)
                    {
                        loader.classList.remove('show');
                        loader.classList.add('hide');
                    }
                if (api_data) {
                    processData(api_data);
                } else {
                    console.error("Failed to fetch API data");
                }
            })();
        } else {
            console.error(`City not found in data array: ${new_city_name}`);
        }
    });

    function processData(api_data) {
        let arr = api_data.dataseries;
        let output = document.querySelector('.output');
        output.innerHTML = ""; // Clear previous output

        let current_date = new Date();
        for (let index = 0; index < 56; index += 8) {
            const element1 = arr[index];
            const element2 = arr[index + 1];
            let min_temp = element1.temp2m;
            let max_temp = element2.temp2m;
            let weather = element1.weather;
            let cloudcover = element1.cloudcover;
            let image_url;

            switch (element1.weather) {
                case "ishowerday":
                case "ishowernight":
                    weather = "intermittent showers"
                    image_url = '../images/ishower.png'
                    break;
                case "lightrainnight":
                case "lightrainday":
                    weather = "light rain";
                    image_url = '../images/lightrain.png';
                    break;
                case "oshowerday":
                case "oshowernight":
                    weather = "occasional rain";
                    image_url = '../images/oshower.png';
                    break;
                case "clearday":
                case "clearnight":
                    weather = "clear";
                    image_url = '../images/clear.png';
                    break;
                case "mcloudynight":
                case "mcloudyday":
                    weather = "cloudy";
                    image_url = '../images/mcloudy.png';
                    break;
                case "pcloudynight":
                case "pcloudyday":
                    weather = "partly cloudy";
                    image_url = '../images/pcloudy.png';
                    break;
                case "cloudyday":
                case "cloudynight":
                    weather = "cloudy";
                    image_url = '../images/cloudy.png';
                    break;
                case "humidday":
                case "humidnight":
                    weather = "humid"
                    image_url = '../images/humid.png'
                    break;
                case "lightsnowday":
                case "lightsnownight":
                    weather = "light snow"
                    image_url = '../images/lightsnow.png';
                    break;
                case "snowday":
                case "snownight":
                    weather = "snow"
                    image_url = '../images/snow.png';
                    break;
                case "rainday":
                case "rainnight":
                    weather = "rain"
                    image_url = '../images/rain.png'
                    break;
                case "rainsnowday":
                case "rainsnownight":
                    weather = "rain and snow"
                    image_url = '../images/rainsnow.png'
                    break;
                case "tsday":
                case "tsnight":
                    weather = "thunderstorm"
                    image_url = '../images/tstorm.png'
                    break;
                case "tsrainday":
                case "tsrainnight":
                    weather = "thunderstorm with rain"
                    image_url = '../images/tsrain.png'
                default:
                    weather = element1.weather;
                    image_url = '../images/windy.png';
                    break;
            }

            for (let ind = index; ind < index + 8; ind++) {
                const element = arr[ind];
                min_temp = Math.min(min_temp, element.temp2m);
                max_temp = Math.max(max_temp, element.temp2m);
            }

            // Create the card
            let card = document.createElement('div');
            card.classList.add('weather-card'); // Add a class for styling purposes

            // Create the image div
            let img = document.createElement('div');
            img.style.backgroundImage = `url(${image_url})`;
            img.classList.add('weather-image'); // Add a class for styling purposes

            // Append the image to the card
            card.appendChild(img);

            // Create and append additional information to the card
            let info = document.createElement('div');
            info.classList.add('weather-info');
            info.innerHTML = `
                <p>Date: ${current_date.toDateString()}</p>
                <p>Weather: ${weather}</p>
                <p>Min Temp: ${min_temp}°C</p>
                <p>Max Temp: ${max_temp}°C</p>
            `;
            card.appendChild(info);

            // Append the card to the output element
            output.appendChild(card);

            // Increment the date by one day for the next card
            current_date.setDate(current_date.getDate() + 1);
        }
    }

    main();
});
