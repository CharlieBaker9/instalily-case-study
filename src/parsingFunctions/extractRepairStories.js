function extractRepairStories($) {
  const repairInstructions = $('.repair-story').map(function() {
    const title = $(this).find('.repair-story__title').text().trim();
    let instructionContent = $(this).find('.repair-story__instruction__content').text().replace(/(\.\.\. Read more|Read less)/g, '').trim();
    const partsUsed = $(this).find('.repair-story__parts a').map(function () {
      return $(this).text().trim();
    }).get().join(', ');
    const name = $(this).find('.repair-story__details li').eq(0).text().trim().replace(/[^a-zA-Z\s,]/g, '');
    const difficultyLevel = $(this).find('.repair-story__details li').eq(1).text().replace('Difficulty Level:', '').trim();
    const totalRepairTime = $(this).find('.repair-story__details li').eq(2).text().replace('Total Repair Time:', '').trim();
    const toolsText = $(this).find('.repair-story__details li').eq(3).text().replace('Tools:', '').trim();
    const tools = toolsText.split(',').map(s => s.trim()).join(', ');

    return {
      title,
      instructionContent: instructionContent.replace(/[\r\n]+/g, ' '),  // Removing new lines from content
      partsUsed,
      name,
      difficultyLevel,
      totalRepairTime,
      tools
    };
  }).get();

  return repairInstructions;
}

module.exports = extractRepairStories;