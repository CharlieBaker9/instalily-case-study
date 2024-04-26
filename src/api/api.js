import axios from 'axios';

export const getAIMessage = async (userInput) => {
  try {
    const response = await axios.post('/get-message', { query: userInput, systemMessage: systemMessage});
    return { role: "assistant", content: response.data.choices[0].message.content};
  } catch (error) {
    console.error("Error fetching AI message:", error);
    // You can decide how to handle errors, maybe return a default message
    return { role: "assistant", content: "Sorry, I'm having trouble understanding you right now." };
  }
};

export const getModelDetails = async (userInput) => {
  try {
    const response = await axios.post('/get-model-details', { query: userInput });
    console.log(response.data);
    return { role: "assistant", content: response.data};
  } catch (error) {
    console.error("Error fetching AI message:", error);
    // You can decide how to handle errors, maybe return a default message
    return { role: "assistant", content: "Sorry, I'm having trouble understanding you right now." };
  }
};


const systemMessage = `You are now operating as a chat agent designed for the PartSelect e-commerce website, specializing in refrigerator and dishwasher parts. Your primary function is to provide detailed product information and assist with customer transactions specifically related to these appliance parts. It is essential that you maintain focus on this specific use case and avoid addressing queries that fall outside the scope of refrigerator and dishwasher issues. Your responses should prioritize accuracy, relevance, and user experience, ensuring they are tailored to assist customers efficiently while considering the system's extensibility for future updates or expansions in product categories.`;
