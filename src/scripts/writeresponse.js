const newman = require('newman');
const fs = require('fs');
const path = require('path');

let allHolidays = {};

// Define output directory
const outputDir = path.join(__dirname, 'country holidays');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

newman.run({
    collection: require('./getHoliday.postman_collection.json'),
    environment: require('./environment.postman_environment.json'),
}).on('request', function (error, data) {
    if (error) {
        console.error(error);
        return;
    }

  // Join the path items into a single string
  const fullPath = data.item.request.url.path.join('/');

  // Split the resulting string by '/'
  const pathParts = fullPath.split('/');

  // The calendar ID is the fourth part of the path
  const calendarID = pathParts[3];  // 'en.bd%23holiday%40group.v.calendar.google.com' or 'en.australian%23holiday%40group.v.calendar.google.com'
  const country_calendarID = `${data.item.name} ${decodeURIComponent(calendarID)}`;

  console.log(`Calendar ID for ${data.item.name}: ${decodeURIComponent(calendarID)}`);


  // Assuming `name` field in the request can be used as filename
  const filename = data.item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // replace non-alphanumeric characters with underscore and make it lower case

  // Write file to output directory
  fs.writeFile(path.join(outputDir, `${filename}.json`), data.response.stream.toString(), function (error) {
    if (error) { 
        console.error(error);
    } else {
        console.log(`Response saved to ${filename}.json`);

        let responseData = JSON.parse(data.response.stream.toString());

        let holidays = responseData.items.filter(item => !item.description.includes('observance')).map(item => ({
            date: item.start.date,
            name: item.summary,
        }));

        allHolidays[country_calendarID] = holidays;
    }
});        
}).on('done', function (error) {
  if (error) {
      console.error(error);
      return;
  }

  // Write allHolidays to output directory
  fs.writeFile(path.join(outputDir, 'holidays.json'), JSON.stringify(allHolidays, null, 2), function (error) {
      if (error) { 
          console.error(error); 
      } else {
          console.log(`All holidays saved to holidays.json`);
      }
  });
});