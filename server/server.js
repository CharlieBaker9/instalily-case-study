require('dotenv').config();
const cheerio = require('cheerio');
const express = require('express');
const fetch = require('node-fetch');
const OpenAI = require('openai');
const app = express();
app.use(express.json());

const parseModelHtmlToJSON = require('./parsingFunctions/parseModelHtmlToJson');
const parsePartHtmlToJSON = require('./parsingFunctions/parsePartHtmlToJSON');
const extractPartsByModel = require('./parsingFunctions/extractPartsByModel');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/get-message', async (req, res) => {
  try {
    let conversationHistory = req.body.conversationHistory;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationHistory,
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.post('/get-model-details', async (req, res) => {
  const modelNumber = req.body.modelNumber;
  const apiUrl = `https://www.partselect.com/Models/${modelNumber}`; // Replace with the actual API URL

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const html = await response.text();
    const info = parseModelHtmlToJSON(html);
    res.send(info);
    
  } catch (error) {
    console.error('Error fetching model data:', error);
    res.status(500).send('Failed to retrieve model details');
  }
});

app.post('/find-part', async (req, res) => {
  const partNumber = req.body.partNumber;
  const apiUrl = `https://www.partselect.com/Models/10640262010/Parts/?SearchTerm=${partNumber}`; // Replace with the actual API URL

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const html = await response.text();

    const $ = cheerio.load(html);
    const info = extractPartsByModel($);
    res.send(info);
    
  } catch (error) {
    console.error('Error fetching model data:', error);
    res.status(500).send('Failed to retrieve part details for model');
  }
});

app.post('/get-part-details', async (req, res) => {
  const partUrl = req.body.partUrl;

  const baseUrl = 'https://www.partselect.com';
  const fullUrl = baseUrl + partUrl;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const html = await response.text();
    const info = parsePartHtmlToJSON(html);
    res.send(info); 
  } catch (error) {
    console.error('Error fetching part details:', error);
    res.status(500).send('Failed to retrieve part details');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
