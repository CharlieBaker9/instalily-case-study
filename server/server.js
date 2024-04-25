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
    const userQuery = req.body.query;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": systemMessage},
        {"role": "user", "content": userQuery}
      ],
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const systemMessage = `You are now operating as a chat agent designed for the PartSelect e-commerce website, specializing in refrigerator and dishwasher parts. Your primary function is to provide detailed product information and assist with customer transactions specifically related to these appliance parts. It is essential that you maintain focus on this specific use case and avoid addressing queries that fall outside the scope of refrigerator and dishwasher issues. Your responses should prioritize accuracy, relevance, and user experience, ensuring they are tailored to assist customers efficiently while considering the system's extensibility for future updates or expansions in product categories.`;
