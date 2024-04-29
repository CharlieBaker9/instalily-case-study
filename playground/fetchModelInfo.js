const extractQuestionsAndAnswers = require('../src/parsingFunctions/extractQuestionsAndAnswers');
const extractRepairStories = require('../src/parsingFunctions/extractRepairStories');
const extractPartsByModel = require('../src/parsingFunctions/extractPartsByModel');
const axios = require('axios');  
const cheerio = require('cheerio');

/**
 * Fetches data from PartSelect based on a given model number.
 * @param {string} modelNumber The model number to fetch details for.
 * @returns {Promise<Object>} The API response containing the model details.
 */
async function fetchModelInfo(modelNumber) {
  const url = `https://www.partselect.com/Models/${modelNumber}`;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    //Extracting Part Select and Manufacturer Numbers
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content').trim();
  
    // Extract troubleshooting, questions and answers, and model cross-referenc
    const qaText = $('#QuestionsAndAnswers').next().text().trim(); 
    const questionsAndAnswers = extractQuestionsAndAnswers(qaText);
    const parts = extractPartsByModel($);
    const symptomsText = $('#Symptoms').next().text().trim().replace(/\s+/g, ' ');
    const repairStories = extractRepairStories($);
    
    return {
      title,
      description,
      questionsAndAnswers,
      parts,
      symptomsText,
      repairStories
    };
   
  } catch (error) {
    console.error('Error fetching data from PartSelect:', error);
  }
}

// The model number to test
const modelNumber = 'WDT780SAEM1';

// Call the function when the script is run
fetchModelInfo(modelNumber);

