function extractReviews(text) {
  const reviewPattern = /(\w+ \w+ - \w+ \d+, \d+)[\s\S]*?Verified Purchase[\s\S]*?(?=\w+ \w+ - \w+ \d+, \d+|$)/g;
  const reviews = [];
  let match;
  while ((match = reviewPattern.exec(text)) !== null) {
      // Normalize whitespace by replacing multiple spaces and newlines with a single space
      const cleanedText = match[0].replace(/\s+/g, ' ').trim();
      reviews.push(cleanedText);
  }
  return reviews;
}

module.exports = extractReviews;