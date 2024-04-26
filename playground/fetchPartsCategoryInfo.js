const axios = require('axios');
const cheerio = require('cheerio');

async function fetchCategoryHtml(url, category) {
    const baseUrl = 'https://www.partselect.com';
    const fullUrl = `${baseUrl}${url}#${category}`;

    try {
        // Fetch the HTML content from the composed URL
        const response = await axios.get(fullUrl);
        const html = response.data;

        // Optionally, if you need to manipulate or extract data from the HTML:
        const $ = cheerio.load(html);
        const categoryContent = $(`#${category}`).html();  // Adjust this if the category is not an id

        return {
            fullHtml: html,                // The entire HTML of the page
            categoryContent: categoryContent  // HTML content of the specific category section
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;  // Re-throw the error for further handling if necessary
    }
}

const partUrl = '/PS11737961-Whirlpool-W10854221-CNTRL-ELEC.htm?SourceCode=25&SearchTerm=WDT780SAEM1&ModelNum=WDT780SAEM1';
const category = 'Troubleshooting';

// Call the function with the specified URL and category
fetchCategoryHtml(partUrl, category)
    .then(result => {
        console.log('HTML Content:', result.fullHtml);
        console.log('Category Content:', result.categoryContent);
    })
    .catch(error => {
        console.error('Error fetching category HTML:', error);
    });

module.exports = fetchCategoryHtml; // Export the function for use in other parts of your project
