import { getAIMessage } from "../api/api";

async function analyzeAIResponseForAction(messages) {
  // Check for model and part numbers or indicators of missing info

  const info = "Reflecting on our previous conversations, please check and respond with a comma separated list where: - The first element should be a Boolean value: true if all necessary information (model number, and part number if discussing a specific part) is provided, or true if only the model number is provided and no part number is necessary. Set it to false if the model number is missing or if a part number is necessary but not provided. - The second element should explicitly list the model number if available, prefixed with 'Model number: ' (e.g., 'Model number: WDT780SAEM1'). The third element should explicitly list the part number if available, prefixed with 'Part number: ' (e.g., 'Part number: W10195416'). - If either the model number or part number is not provided and is needed, please include 'additional information needed' in the list to specify what is missing.";

  const response = await getAIMessage([...messages, { role: "system", content: info }]);

  const trimmedResponse = response.content.trim().replace(/^\[|\]$/g, '');
  const responses = trimmedResponse.split(',').map(item => item.trim().replace(/^"|"$/g, ''));

  if (responses[0].includes("true")){
    let modelNumber = responses[1].split(': ')[1];
    if (responses.length === 3){
      let partNumber = responses[2].split(': ')[1];
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
