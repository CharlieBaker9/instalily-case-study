function extractModelCrossReference($, $section) {
  if (!$section.length) return [];

  let models = [];
  $section.find('.row').each(function() {
      const brand = $(this).find('.col-6.col-md-3:first-child').text().trim();
      const modelNumber = $(this).find('a.col-6.col-md-3.col-lg-2').text().trim();
      const description = $(this).find('.col.col-md-6.col-lg-7').text().trim().replace(/ - DISHWASHER/, '');

      if (brand && modelNumber) models.push({ brand, modelNumber, description });
  });
  return models;
}

module.exports = extractModelCrossReference;