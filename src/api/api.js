import axios from 'axios';

export const getAIMessage = async (userInput) => {
  try {

    const response = await axios.post('/get-message', { query: userInput });
    return { role: "assistant", content: response.data.choices[0].message.content };
  } catch (error) {
    console.error("Error fetching AI message:", error);
    // You can decide how to handle errors, maybe return a default message
    return { role: "assistant", content: "Sorry, I'm having trouble understanding you right now." };
  }
};