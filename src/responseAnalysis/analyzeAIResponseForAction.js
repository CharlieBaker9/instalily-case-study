// analyzeAIResponseForAction.js

function analyzeAIResponseForAction(text) {
  // Check for model and part numbers or indicators of missing info
  const hasModelNumber = /model number: (\w+)/i.exec(text);
  const hasPartNumber = /part number: (\w+)/i.exec(text);

  if (hasModelNumber && hasPartNumber) {
    return {
      type: 'both',
      modelNumber: hasModelNumber[1],
      partNumber: hasPartNumber[1] 
    };
  } else if (hasModelNumber) {
    return {
      type: 'model',
      modelNumber: hasModelNumber[1],
  };
  } else {
    return {
      type: 'none',
    };
  }
}

export default analyzeAIResponseForAction; 
