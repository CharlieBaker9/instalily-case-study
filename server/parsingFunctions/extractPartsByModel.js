function extractPartsByModel($) {  
  const parts = [];
  $('.qna__question__related').each((index, element) => {
    const $element = $(element);
    const partName = $element.find('a.d-block.bold.mb-2').text().trim();
    const partNumber = $element.find('img').attr('title') ? $element.find('img').attr('title').match(/Part Number: (\w+)/)[1] : '';
    const price = $element.find('.price.bold').text().trim();
    const imageUrl = $element.find('img').data('src');
    const partUrl = $element.find('a.d-block').attr('href');
    parts.push({ partName, partNumber, price, imageUrl, partUrl });
  });
  return parts;
}

module.exports = extractPartsByModel;  