import { getAIMessage } from "../api/api";

async function analyzeAIResponseForAction(messages) {
  // Check for model and part numbers or indicators of missing info

  const info = "Based on our previous conversations, please check and respond with a list. The first element of the list should be a Boolean value: true if all necessary information (model number, and part number if discussing a specific part) is provided, or false if more information is required. The subsequent elements should list the model number or part number if available, or 'additional information needed' if not.";

  const response = await getAIMessage([...messages, { role: "user", content: info }]);
  console.log(response.content);
  const responses = response.content.split(',');

  if (responses[0] === true){
    let modelNumber = responses[0].split(': ')[1].trim();
    if (responses.length === 3){
      let partNumber = responses[1].split(': ')[1].trim();
      return {
        type: 'both',
        modelNumber: modelNumber,
        partNumber: partNumber 
      };
    } else {
      return {
        type: 'model',
        modelNumber: modelNumber,
      };
    }
  } else {
    return {
      type: 'none',
    };
  }
}

export default analyzeAIResponseForAction; 
