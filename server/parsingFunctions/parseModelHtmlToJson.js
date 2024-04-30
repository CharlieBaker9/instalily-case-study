const extractQuestionsAndAnswers = require('./extractQuestionsAndAnswers');
const extractRepairStories = require('./extractRepairStories');
const extractPartsByModel = require('./extractPartsByModel');
const cheerio = require('cheerio');

function parseModelHtmlToJSON(html) {
  const $ = cheerio.load(html);

  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') ? $('meta[name="description"]').attr('content').trim() : '';

  const qaElement = $('#QuestionsAndAnswers').next();
  const qaText = qaElement.length ? qaElement.text().trim() : '';
  const questionsAndAnswers = extractQuestionsAndAnswers(qaText);
  const parts = extractPartsByModel($);

  const symptomsElement = $('#Symptoms').next();
  const symptomsText = symptomsElement.length ? symptomsElement.text().trim().replace(/\s+/g, ' ') : '';
  
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
