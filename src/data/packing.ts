import { PackingItem } from '../types/trip';

export const DEFAULT_PACKING_ITEMS: { category: string; items: string[] }[] = [
  {
    category: 'Essential Documents',
    items: [
      'Passport & Visas (plus digital copies)',
      'Flight tickets & Boarding passes',
      'Travel insurance policy document',
      'Hotel & booking confirmations',
      'Credit cards & local foreign currency cash',
      'Driver\'s license & International permit',
    ],
  },
  {
    category: 'Tech & Electronics',
    items: [
      'Smartphone & high-speed charger',
      'Universal travel power plug adapter',
      'Portable power bank (10,000–20,000 mAh)',
      'Noise-canceling earphones or headphones',
      'Camera, memory cards & spare battery',
      'E-reader or tablet with downloaded books',
    ],
  },
  {
    category: 'Clothing & Footwear',
    items: [
      'Comfortable walking shoes / trail sneakers',
      'Lightweight breathable layers / shirts',
      'Packable rain jacket or compact umbrella',
      'Casual evening outfit for dinners',
      'Modest temple/cathedral attire (shoulders & knees covered)',
      'Swimwear & quick-dry microfiber towel',
      'Sunglasses with UV protection',
    ],
  },
  {
    category: 'Health & Personal Care',
    items: [
      'Prescription medicines & copy of script',
      'Travel first-aid kit (bandages, antiseptic)',
      'Sunscreen SPF 50+ & lip balm',
      'Insect repellent spray / wipes',
      'Hydration electrolyte packets',
      'Travel-size toiletries & toothbrush',
    ],
  },
];

export function createInitialPackingList(tripId: string): PackingItem[] {
  const result: PackingItem[] = [];
  let idCounter = 1;
  for (const group of DEFAULT_PACKING_ITEMS) {
    for (const item of group.items) {
      result.push({
        id: `pack-${tripId}-${idCounter++}`,
        tripId,
        item,
        category: group.category,
        packed: false,
      });
    }
  }
  return result;
}
