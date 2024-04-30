function extractPartsByModel($) {
  const parts = [];
  $('div.row.mt-3.align-items-stretch > div[class^="col-md-6 mb-3"]').each((index, element) => {
    const $element = $(element);

    const partName = $element.find('a').attr('title') ? $element.find('a').attr('title').split(' – ')[0].trim() : '';
    const partNumberMatch = $element.find('a').attr('title') && $element.find('a').attr('title').match(/Part Number: (\w+)/);
    const partNumber = partNumberMatch ? partNumberMatch[1].trim() : '';

    const price = $element.find('.mega_m_part_price_mt-2 .price_currency').first().text().trim() || 'Not Available';
    const imageUrl = $element.find('img').attr('data-src') || $element.find('img').attr('src') || 'PlaceholderImageURL';
    const linkElement = $element.find('a');
    const partUrl = linkElement.length ? linkElement.attr('href') : '';

    const inStock = $element.find('.some-stock-class').length > 0;

    parts.push({
      partName: partName || 'Part Name Not Available',
      partNumber: partNumber || 'Part Number Not Available',
      price,
      imageUrl,
      partUrl,
      inStock
    });
  });
  return parts;
}

module.exports = extractPartsByModel;  