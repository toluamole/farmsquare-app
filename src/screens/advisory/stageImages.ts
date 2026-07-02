// Static require map for advisory stage illustrations.
// Keys match the `img` field on JourneyStage entries served by
// src/services/advisory.ts (crop journey + poultry stage illustrations).

export const STAGE_IMAGES: Record<string, any> = {
  // Crop journey stages
  'site-selection': require('../../../assets/advisory/site-selection.jpg'),
  'field-preparation': require('../../../assets/advisory/field-preparation.jpg'),
  'seed-procurement': require('../../../assets/advisory/seed-procurement.jpg'),
  'seed-treatment': require('../../../assets/advisory/seed-treatment.jpg'),
  'sowing': require('../../../assets/advisory/sowing.jpg'),
  'irrigation': require('../../../assets/advisory/irrigation.jpg'),
  'weeding': require('../../../assets/advisory/weeding.jpg'),
  'fertilizer': require('../../../assets/advisory/fertilizer.jpg'),
  'plant-protection': require('../../../assets/advisory/plant-protection.jpg'),
  'crop-growth': require('../../../assets/advisory/crop-growth.jpg'),
  'harvesting': require('../../../assets/advisory/harvesting.jpg'),
  'post-field': require('../../../assets/advisory/post-field.jpg'),
  'storage': require('../../../assets/advisory/storage.jpg'),

  // Poultry journey stages
  'poultry-site': require('../../../assets/advisory/poultry-site.jpg'),
  'poultry-prep': require('../../../assets/advisory/poultry-prep.jpg'),
  'poultry-equipment': require('../../../assets/advisory/poultry-equipment.jpg'),
  'chick-procurement': require('../../../assets/advisory/chick-procurement.jpg'),
  'brooding': require('../../../assets/advisory/brooding.jpg'),
  'feeding': require('../../../assets/advisory/feeding.jpg'),
  'vaccination': require('../../../assets/advisory/vaccination.jpg'),
  'poultry-sales': require('../../../assets/advisory/poultry-sales.jpg'),

  // Hero illustration
  'advisory-hero': require('../../../assets/advisory/advisory-hero.jpg'),
};

export default STAGE_IMAGES;
