require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const app = express();
app.use(express.json());

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
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching model data:', error);
    res.status(500).send('Failed to retrieve model details');
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
    const data = await response.text(); // Get raw HTML since no parsing to JSON is done
    res.send(data); // Send raw HTML back to client
  } catch (error) {
    console.error('Error fetching part details:', error);
    res.status(500).send('Failed to retrieve part details');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
