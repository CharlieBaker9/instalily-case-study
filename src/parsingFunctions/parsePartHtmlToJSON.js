const cheerio = require('cheerio');
const { extractReviews } = require('./extractReviews');
const { extractQuestionsAndAnswers } = require('./extractQuestionsAndAnswers');
const { extractModelCrossReference } = require('./extractModelCrossReference');

function parsePartHtmlToJSON(html) {
  const $ = cheerio.load(html);
  //Extracting Part Select and Manufacturer Numbers
  const text = $('div:contains("PartSelect Number")').text();
  const match1 = text.match(/PartSelect Number\s*([^\n]*)/i); // Adjust regex according to actual text format
  const match2 = text.match(/Manufacturer Part Number\s*([^\n]+)/);

  // Extract product information
  const productInfo = {
    name: $('h1[itemprop="name"]').text().trim().replace(/\s+[A-Z0-9]+$/, ''),  // Removes last part (model number)
    partSelectNumber: match1 ? match1[1].trim() : '',
    manufacturerPartNumber: match2 ? match2[1].trim() : '',
    brand: $('span[itemprop="brand"] > span[itemprop="name"]').text().trim(),
    price: $('span[itemprop="price"]').text().replace(/\s+/g, '').trim(),
    availability: $('span[itemprop="availability"]').attr('content').trim()
  };

  // Extract troubleshooting, customer reviews, questions and answers, and model cross-reference
  const troubleshooting = $('#Troubleshooting').next().text().replace(/\s+/g, ' ').trim();
  const fullText = $('#CustomerReviews').next().text().trim();
  const customerReviews = extractReviews(fullText);
  const qaText = $('#QuestionsAndAnswers').next().text().trim(); 
  const questionsAndAnswers = extractQuestionsAndAnswers(qaText)
  const modelCrossReference = extractModelCrossReference($, $('#ModelCrossReference').next());

  return {
    productInfo,
    troubleshooting,
    customerReviews,
    questionsAndAnswers,
    modelCrossReference
  };
}

module.exports = parsePartHtmlToJSON; 