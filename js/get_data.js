// get_data.js

const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = '../city_coordinates.csv'; // Path to your CSV file

async function getData() {
    return new Promise((resolve, reject) => {
        const result = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => result.push(data))
            .on('end', () => {
                resolve(result);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

(async function main(){let result = await getData()
    // console.log(result)
    module.exports = result
    result = JSON.stringify(result)
    fs.writeFileSync('../city_data.txt', result)
})()

