import { TravelStyle, ActivityItem } from '../../types/trip';

export interface GeneratedDayPlan {
  title: string;
  theme: string;
  activities: Omit<ActivityItem, 'id' | 'columnId' | 'order'>[];
}

export interface GeneratedCustomItinerary {
  days: GeneratedDayPlan[];
  backlog: Omit<ActivityItem, 'id' | 'columnId' | 'order'>[];
}

/**
 * Generates dynamic days and activity suggestions for any custom destination worldwide.
 */
export function generateCustomTripItinerary(
  destination: string,
  country: string,
  daysCount: number,
  currency: string,
  style: TravelStyle,
  dailyBudget: number
): GeneratedCustomItinerary {
  const generatedDays: GeneratedDayPlan[] = [];
  const baseCurrencyCost = (ratio: number) => Math.round(dailyBudget * ratio);

  const styleThemes: Record<TravelStyle, string[]> = {
    cultural: [
      'Historic Old Town & Heritage Monuments',
      'Artisanal Traditions & Historic District',
      'Museums, Palaces & Architectural Landmarks',
      'Local Markets & Historic Culinary Route',
      'Sacred Sites & Panoramic Overlooks',
      'Hidden Neighborhoods & Folk Artisan Walk',
      'Farewell Cultural Showcase & Evening Concert',
    ],
    relaxed: [
      'Arrival & Slow Scenic Promenade',
      'Botanical Gardens & Riverside Cafe Stroll',
      'Spa Wellness & Quiet Waterfront Lunch',
      'Scenic Viewpoints & Open-air Markets',
      'Afternoon Reading in Shaded Gardens',
      'Cozy Bookshops & Sunset Golden Hour',
      'Leisurely Brunch & Peaceful Departure',
    ],
    foodie: [
      'Arrival & Iconic Street Food Crawl',
      'Central Produce Market & Cooking Class',
      'Historic Bakeries & Specialty Coffee Roasters',
      'Vineyard / Brewery Tasting & Regional Feast',
      'Hidden Laneway Eateries & Dessert Boutiques',
      'Fine Dining / Chef\'s Tasting Menu Experience',
      'Gourmet Food Souvenirs & Farewell Feast',
    ],
    adventure: [
      'Arrival, Trail Briefing & Ridge Walk',
      'Mountain Trekking & Valley Overlook',
      'Kayaking, Water Sports & River Exploration',
      'Off-the-beaten-path Canyon or Cycling Trail',
      'Wilderness Wildlife Observation & Sunset Peak',
      'Zip-lining / Rock Scramble / Eco Exploration',
      'Final Sunrise Summit & Victorious Departure',
    ],
    romantic: [
      'Arrival & Private Balcony Toast',
      'Scenic Waterfront Walk & Intimate Bistro',
      'Sunset Boat Cruise & Candlelight Dinner',
      'Couples Spa Day & Artisan Perfumery Visit',
      'Secret Garden Picnic & Wine Tasting',
      'Rooftop Cocktails overlooking City Lights',
      'Slow Morning Breakfast & Scenic Farewell',
    ],
    budget: [
      'Free Walking Tour & Orientation Stroll',
      'Affordable Street Market Bites & Public Parks',
      'Free Museum Admission & Landmark Scavenger Hunt',
      'Public Transit Exploration of Outer Districts',
      'Scenic High Point Picnic & Sunset Viewpoint',
      'Hostel Gathering & Budget Friendly Feasts',
      'Final Market Souvenir Browsing & Departure',
    ],
    luxury: [
      'VIP Airport Transfer & Luxury Suite Welcome',
      'Private Chauffeur Landmark Tour & Caviar Lunch',
      'Michelin-starred Degustation & Opera Night',
      'Private Yacht / Helicopter Scenic Charter',
      'Exclusive Designer Boutique Shopping & Stylist',
      'Holistic Wellness Retreat Day & Champagne Lounge',
      'Private Rooftop Brunch & Seamless First-Class Departure',
    ],
  };

  const themes = styleThemes[style] || styleThemes.cultural;

  for (let d = 1; d <= daysCount; d++) {
    const themeIndex = (d - 1) % themes.length;
    const themeTitle = themes[themeIndex];

    const activities: Omit<ActivityItem, 'id' | 'columnId' | 'order'>[] = [
      {
        title: d === 1 ? `Arrive in ${destination} & Check-in` : `Morning Exploration in ${destination}`,
        category: d === 1 ? 'stay' : 'sightseeing',
        timeStart: '09:30',
        timeEnd: '11:30',
        duration: '2h',
        cost: d === 1 ? baseCurrencyCost(0.4) : baseCurrencyCost(0.15),
        currency,
        locationName: `${destination} Central District`,
        notes: d === 1 ? 'Settle in, unpack, get local transport pass' : 'Explore highlights while streets are quiet',
        status: d === 1 ? 'booked' : 'planned',
        priority: 'must-do',
      },
      {
        title: `Lunch at authentic ${destination} local cafe`,
        category: 'dining',
        timeStart: '12:30',
        timeEnd: '14:00',
        duration: '1h 30m',
        cost: baseCurrencyCost(0.2),
        currency,
        locationName: `${destination} Old Quarter`,
        notes: 'Try seasonal local specialty dish with artisan beverage',
        status: 'planned',
        priority: 'recommended',
      },
      {
        title: `Afternoon ${themeTitle.split('&')[0].trim()}`,
        category: style === 'adventure' ? 'outdoor' : 'culture',
        timeStart: '15:00',
        timeEnd: '17:30',
        duration: '2h 30m',
        cost: baseCurrencyCost(0.15),
        currency,
        locationName: `${destination} Cultural Quarter`,
        notes: `Immerse in local atmosphere and signature ${destination} heritage`,
        status: 'planned',
        priority: 'must-do',
      },
      {
        title: `Evening Dinner & Sunset Stroll`,
        category: 'dining',
        timeStart: '19:30',
        timeEnd: '21:30',
        duration: '2h',
        cost: baseCurrencyCost(0.25),
        currency,
        locationName: `${destination} Waterfront / City Center`,
        notes: 'Watch the lights glow across the destination skyline',
        status: 'planned',
        priority: 'recommended',
      },
    ];

    generatedDays.push({
      title: `Day ${d}: ${themeTitle.split('&')[0].trim()}`,
      theme: themeTitle,
      activities,
    });
  }

  const backlog: Omit<ActivityItem, 'id' | 'columnId' | 'order'>[] = [
    {
      title: `Hidden Rooftop Sunset Bar in ${destination}`,
      category: 'dining',
      cost: baseCurrencyCost(0.2),
      currency,
      locationName: `${destination} Skyline`,
      notes: 'Panoramic views of the city at dusk',
      status: 'planned',
      priority: 'recommended',
    },
    {
      title: `Day Trip to nearby scenic countryside / village`,
      category: 'outdoor',
      cost: baseCurrencyCost(0.35),
      currency,
      locationName: `${destination} Surroundings`,
      notes: 'Scenic transport ride through lush valleys',
      status: 'planned',
      priority: 'optional',
    },
    {
      title: `Artisanal Craft & Souvenir Market`,
      category: 'shopping',
      cost: baseCurrencyCost(0.25),
      currency,
      locationName: `${destination} Artisan Alley`,
      notes: 'Handcrafted ceramics, textiles, and local delicacies',
      status: 'planned',
      priority: 'optional',
    },
  ];

  return { days: generatedDays, backlog };
}
