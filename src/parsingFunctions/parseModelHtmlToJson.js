const extractQuestionsAndAnswers = require('./extractQuestionsAndAnswers');
const extractRepairStories = require('./extractRepairStories');
const extractPartsByModel = require('./extractPartsByModel');
const cheerio = require('cheerio');

async function parseModelHtmlToJSON(html) {
  const $ = cheerio.load(html);
  console.log(html);

  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content').trim();

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
}

module.exports = parseModelHtmlToJSON; 