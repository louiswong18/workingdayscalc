const newman = require('newman');
const fs = require('fs');
const path = require('path');

let allHolidays = {};

newman.run({
    collection: require('./getHoliday.postman_collection.json'),
    environment: require('./environment.postman_environment.json'),
}).on('request', function (error, data) {
    if (error) {
        console.error(error);
        return;
    }
    // Assuming `name` field in the request can be used as filename
    const filename = data.item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // replace non-alphanumeric characters with underscore and make it lower case
    fs.writeFile(path.join(__dirname, `${filename}.json`), data.response.stream.toString(), function (error) {
        if (error) { 
            console.error(error);
        } else {
            console.log(`Response saved to ${filename}.json`);

            let responseData = JSON.parse(data.response.stream.toString());

            // Assuming the holidays are in the `items` array
            let holidays = responseData.items.filter(item => !item.description.includes('observance')).map(item => ({
                date: item.start.date,
                name: item.summary,
            }));

            allHolidays[filename] = holidays;
        }
    });        
}).on('done', function (error, summary) {
    if (error) {
        console.error(error);
        return;
    }
    fs.writeFile(path.join(__dirname, 'holidays.json'), JSON.stringify(allHolidays, null, 2), function (error) {
        if (error) { 
            console.error(error); 
        } else {
            console.log(`All holidays saved to holidays.json`);
        }
    });
});