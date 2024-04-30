import axios from 'axios';

export const getAIMessage = async (conversationHistory) => {
  try {
    const response = await axios.post('/get-message', { conversationHistory: conversationHistory});
    return { role: "assistant", content: response.data.choices[0].message.content};
  } catch (error) {
    console.log(error);
    return { role: "assistant", content: "Error fetching AI messages" };
  }
};

export const getModelDetails = async (modelNumber) => {
  try {
    const response = await axios.post('/get-model-details', { modelNumber: modelNumber });
    return { content: response.data };
  } catch (error) {
    return { content: "Error fetching model details" };
  }
};

export const findPart = async (partNumber) => {
  try {
    const response = await axios.post('/find-part', { partNumber: partNumber });
    return { content: response.data };
  } catch (error) {
    return { content: "Error fetching model details" };
  }
};

export const getPartDetails = async (partUrl) => {
  try {
    const response = await axios.post('/get-part-details', { partUrl: partUrl });
    return { content: response.data };
  } catch (error) {
    return { content: "Error fetching part details" };
  }
};
