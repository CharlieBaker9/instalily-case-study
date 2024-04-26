const axios = require('axios');
const cheerio = require('cheerio');

function parseHtmlToJSON($) {
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

async function fetchPartsInfo(url) {
  try {
    const baseUrl = 'https://www.partselect.com';
    const fullUrl = baseUrl + url;
    const response = await axios.get(fullUrl);
    const html = response.data;

    const $ = cheerio.load(html);

    const content = parseHtmlToJSON($);
    console.log(content);
    return content;
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    throw error;
  }
}

function extractReviews(text) {
  const reviewPattern = /(\w+ \w+ - \w+ \d+, \d+)[\s\S]*?Verified Purchase[\s\S]*?(?=\w+ \w+ - \w+ \d+, \d+|$)/g;
  const reviews = [];
  let match;
  while ((match = reviewPattern.exec(text)) !== null) {
      // Normalize whitespace by replacing multiple spaces and newlines with a single space
      const cleanedText = match[0].replace(/\s+/g, ' ').trim();
      reviews.push(cleanedText);
  }
  return reviews;
}

function extractQuestionsAndAnswers(text) {
  // Normalize spaces and newlines to simplify matching
  text = text.replace(/\s+/g, ' ');

  // Initialize an array to hold all combined Q&A pairs
  let qaPairs = [];

  // Regular expression to match the structure of date, question, and answer
  let qaRegex = /(\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{4})\s(.*?\?)\s(.*?)(?=(?:people found this helpful|Was this helpful\?))/g;

  let match;
  while ((match = qaRegex.exec(text)) !== null) {
    // Combine the question and answer
    let combinedQA = `${match[2].trim()} ${match[3].trim()}`;

    // Store the combined Q&A
    qaPairs.push(combinedQA);
  }

  return qaPairs.length > 0 ? qaPairs.join('\n\n') : 'No questions or answers available.';
}

function extractModelCrossReference($, $section) {
  if (!$section.length) return [];

  let models = [];
  $section.find('.row').each(function() {
      const brand = $(this).find('.col-6.col-md-3:first-child').text().trim();
      const modelNumber = $(this).find('a.col-6.col-md-3.col-lg-2').text().trim();
      const description = $(this).find('.col.col-md-6.col-lg-7').text().trim().replace(/ - DISHWASHER/, '');

      if (brand && modelNumber) models.push({ brand, modelNumber, description });
  });
  return models;
}

// The model number to test
const partUrl = '/PS11737961-Whirlpool-W10854221-CNTRL-ELEC.htm?SourceCode=25&SearchTerm=WDT780SAEM1&ModelNum=WDT780SAEM1';
const partUrl2 = '/PS11753384-Whirlpool-WPW10348409-Screw.htm?SourceCode=19&SearchTerm=PARB1905CB0&ModelNum=PARB1905CB0';
const partUrl3 = '/PS11745970-Whirlpool-WP841180A-Tray.htm?SourceCode=19&SearchTerm=PARB1905CB0&ModelNum=PARB1905CB0';

// Call the function when the script is run
fetchPartsInfo(partUrl3);

module.exports = fetchPartsInfo; // Export the function if using it in different parts of your project      