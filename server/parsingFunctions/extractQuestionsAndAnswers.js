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

module.exports = extractQuestionsAndAnswers;