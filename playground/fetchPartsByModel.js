// Filename: fetchDataByModel.js
const axios = require('axios');  
const cheerio = require('cheerio');

/**
 * Fetches data from PartSelect based on a given model number.
 * @param {string} modelNumber The model number to fetch details for.
 * @returns {Promise<Object>} The API response containing the model details.
 */
async function fetchPartsByModel(modelNumber) {
  const url = `https://www.partselect.com/Models/${modelNumber}/#parts`;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Create an array to store the parsed data
    const parts = [];

    // Assuming each part is within a div with a class 'qna__question__related'
    $('.qna__question__related').each((index, element) => {
      const $element = $(element);
      const partName = $element.find('a.d-block.bold.mb-2').text().trim();
      const partNumber = $element.find('img').attr('title').match(/Part Number: (\w+)/)[1];
      const price = $element.find('.price.bold').text().trim();
      const imageUrl = $element.find('img').data('src');
      const partUrl = $element.find('a.d-block').attr('href');

      // Push the data to the parts array
      parts.push({ partName, partNumber, price, imageUrl, partUrl });
    });

    console.log(parts);
    return parts;
   
  } catch (error) {
    console.error('Error fetching data from PartSelect:', error);
  }
}

// The model number to test
const modelNumber = 'WDT780SAEM1';

// Call the function when the script is run
fetchPartsByModel(modelNumber);

module.exports = fetchPartsByModel;  // This line allows the module to be required in other Node.js files if necessary
