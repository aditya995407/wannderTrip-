import { TravelStyle } from '../../types/trip';
import { CURATED_DESTINATIONS } from './curatedPresets';

export interface SuggestedActivity {
  title: string;
  category: any;
  timeStart?: string;
  timeEnd?: string;
  duration?: string;
  cost: number;
  currency: string;
  locationName: string;
  locationAddress?: string;
  notes?: string;
  priority: 'must-do' | 'recommended' | 'optional';
}

/**
 * Returns tailored attraction and activity suggestions for a destination.
 */
export function getDestinationSuggestions(
  destinationName: string,
  travelStyle: TravelStyle = 'cultural',
  currency: string = 'USD'
): SuggestedActivity[] {
  const normalized = destinationName.trim().toLowerCase();

  // If matches a curated preset, return activities from that preset
  const preset = CURATED_DESTINATIONS.find(
    (p) =>
      p.destination.toLowerCase() === normalized ||
      normalized.includes(p.destination.toLowerCase()) ||
      p.destination.toLowerCase().includes(normalized)
  );

  if (preset) {
    const list: SuggestedActivity[] = [];
    preset.days.forEach((day) => {
      day.activities.forEach((act) => {
        list.push({
          ...act,
          currency: currency || act.currency,
        });
      });
    });
    preset.backlog.forEach((act) => {
      list.push({
        ...act,
        currency: currency || act.currency,
      });
    });
    return list;
  }

  // Varanasi / Kashi
  if (normalized.includes('varanasi') || normalized.includes('kashi') || normalized.includes('banaras')) {
    return [
      {
        title: 'Dawn Sunrise Wooden Boat Ride on Sacred Ganges',
        category: 'sightseeing',
        timeStart: '05:30',
        timeEnd: '07:30',
        duration: '2h',
        cost: 600,
        currency: 'INR',
        locationName: 'Assi Ghat to Dashashwamedh Ghat',
        notes: 'Watch the sunrise mist rise over the ancient stone ghats as pilgrims take holy morning dip.',
        priority: 'must-do',
      },
      {
        title: 'Dashashwamedh Ghat Grand Evening Ganga Aarti',
        category: 'culture',
        timeStart: '18:00',
        timeEnd: '19:30',
        duration: '1h 30m',
        cost: 0,
        currency: 'INR',
        locationName: 'Dashashwamedh Ghat',
        notes: 'Priests holding giant multi-tiered brass oil lamps chanting synchronized Vedic hymns.',
        priority: 'must-do',
      },
      {
        title: 'Kashi Vishwanath Temple Corridor Visit',
        category: 'culture',
        timeStart: '08:30',
        timeEnd: '10:30',
        duration: '2h',
        cost: 0,
        currency: 'INR',
        locationName: 'Kashi Vishwanath Jyotirlinga, Lahori Tola',
        notes: 'One of the 12 sacred Jyotirlingas of Lord Shiva; golden spires and grand river corridor.',
        priority: 'must-do',
      },
      {
        title: 'Famous Banarasi Street Food & Blue Lassi Tasting',
        category: 'dining',
        timeStart: '12:00',
        timeEnd: '13:30',
        duration: '1h 30m',
        cost: 350,
        currency: 'INR',
        locationName: 'Kachori Gali & Manikarnika Chowk',
        notes: 'Crispy kachori sabzi, jalebis, malaiyo winter foam dessert, and seasonal fruit lassi.',
        priority: 'must-do',
      },
    ];
  }

  // Ladakh / Leh
  if (normalized.includes('ladakh') || normalized.includes('leh') || normalized.includes('pangong')) {
    return [
      {
        title: 'Pangong Tso Lake Day Trip & Azure Water Views',
        category: 'outdoor',
        timeStart: '07:00',
        timeEnd: '17:00',
        duration: '10h',
        cost: 4500,
        currency: 'INR',
        locationName: 'Pangong Tso (14,270 ft)',
        notes: 'Endorheic lake changing shades from deep azure to turquoise; cross Chang La Pass.',
        priority: 'must-do',
      },
      {
        title: 'Drive across Khardung La Pass (18,380 ft)',
        category: 'transport',
        timeStart: '08:00',
        timeEnd: '12:00',
        duration: '4h',
        cost: 2000,
        currency: 'INR',
        locationName: 'Khardung La Pass',
        notes: 'One of the world\'s highest motorable passes with breathtaking snow peak panoramas.',
        priority: 'must-do',
      },
      {
        title: 'Nubra Valley Hunder Sand Dunes & Bactrian Camel Safari',
        category: 'outdoor',
        timeStart: '15:30',
        timeEnd: '18:00',
        duration: '2h 30m',
        cost: 500,
        currency: 'INR',
        locationName: 'Hunder White Sand Dunes, Nubra',
        notes: 'Ride rare double-humped Bactrian camels against snow-capped Karakoram mountains.',
        priority: 'must-do',
      },
      {
        title: 'Thiksey & Hemis Monastery Morning Chanting',
        category: 'culture',
        timeStart: '06:00',
        timeEnd: '09:00',
        duration: '3h',
        cost: 100,
        currency: 'INR',
        locationName: 'Thiksey Monastery (Mini Potala Palace)',
        notes: '12-story hilltop complex housing 49-foot high statue of Maitreya Future Buddha.',
        priority: 'recommended',
      },
    ];
  }

  // Udaipur
  if (normalized.includes('udaipur')) {
    return [
      {
        title: 'City Palace Museum & Mor Chowk Peacock Courtyard',
        category: 'culture',
        timeStart: '09:30',
        timeEnd: '12:30',
        duration: '3h',
        cost: 400,
        currency: 'INR',
        locationName: 'City Palace, Lake Pichola',
        notes: 'Rajasthan\'s largest palace complex built by 22 successive Maharanas.',
        priority: 'must-do',
      },
      {
        title: 'Sunset Boat Cruise on Lake Pichola & Jag Mandir Island',
        category: 'sightseeing',
        timeStart: '17:00',
        timeEnd: '18:30',
        duration: '1h 30m',
        cost: 650,
        currency: 'INR',
        locationName: 'Rameshwar Ghat to Jag Mandir',
        notes: 'Golden reflections illuminating Taj Lake Palace floating on calm waters.',
        priority: 'must-do',
      },
      {
        title: 'Bagore Ki Haveli Evening Dharohar Folk Dance Show',
        category: 'culture',
        timeStart: '19:00',
        timeEnd: '20:15',
        duration: '1h 15m',
        cost: 150,
        currency: 'INR',
        locationName: 'Gangaur Ghat, Bagore Ki Haveli',
        notes: 'Famous Chari dance, fire dance, puppet show, and balance of 10 brass pots on head.',
        priority: 'must-do',
      },
    ];
  }

  // Manali / Solang
  if (normalized.includes('manali') || normalized.includes('solang') || normalized.includes('rohtang')) {
    return [
      {
        title: 'Solang Valley Paragliding & Snow Adventure',
        category: 'outdoor',
        timeStart: '09:00',
        timeEnd: '13:00',
        duration: '4h',
        cost: 2500,
        currency: 'INR',
        locationName: 'Solang Valley (8,500 ft)',
        notes: 'Tandem paragliding glide over pine valleys, zorbing, ATV quad biking, and cable car.',
        priority: 'must-do',
      },
      {
        title: 'Hadimba Wooden Temple & Giant Cedar Forest Walk',
        category: 'culture',
        timeStart: '14:30',
        timeEnd: '16:00',
        duration: '1h 30m',
        cost: 50,
        currency: 'INR',
        locationName: 'Dhungri Van Vihar, Manali',
        notes: 'Four-tiered wooden pagoda temple built in 1553 surrounded by ancient Himalayan cedars.',
        priority: 'must-do',
      },
      {
        title: 'Old Manali Riverside Cafe Hopping & Trout Fish',
        category: 'dining',
        timeStart: '18:00',
        timeEnd: '20:30',
        duration: '2h 30m',
        cost: 850,
        currency: 'INR',
        locationName: 'Old Manali Village Laneways',
        notes: 'Fresh Himalayan river trout pan-fried with lemon butter, woodfired pizza & apple cider.',
        priority: 'recommended',
      },
    ];
  }

  // Rishikesh / Haridwar
  if (normalized.includes('rishikesh') || normalized.includes('haridwar')) {
    return [
      {
        title: 'White Water River Rafting on the Holy Ganges (16 km)',
        category: 'outdoor',
        timeStart: '09:00',
        timeEnd: '12:30',
        duration: '3h 30m',
        cost: 1000,
        currency: 'INR',
        locationName: 'Shivpuri to Lakshman Jhula',
        notes: 'Tackle thrilling Class III & IV rapids with cliff jump break.',
        priority: 'must-do',
      },
      {
        title: 'Parmarth Niketan Ashram Sunset Ganga Aarti',
        category: 'culture',
        timeStart: '17:30',
        timeEnd: '19:00',
        duration: '1h 30m',
        cost: 0,
        currency: 'INR',
        locationName: 'Parmarth Niketan Ghat, Swarg Ashram',
        notes: 'Sacred twilight ceremony on the banks of the Ganges with Vedic chants and oil lamps.',
        priority: 'must-do',
      },
    ];
  }

  // Default generative fallback for any other destination worldwide
  const dest = destinationName.trim() || 'Destination';

  return [
    {
      title: `Visit ${dest} Historic Landmark & Old Town`,
      category: 'sightseeing',
      timeStart: '09:30',
      timeEnd: '11:30',
      duration: '2h',
      cost: 15,
      currency,
      locationName: `${dest} Old City Center`,
      notes: 'Explore primary historical highlights, architecture, and iconic viewpoints.',
      priority: 'must-do',
    },
    {
      title: `Authentic Local Dining & Food Tasting in ${dest}`,
      category: 'dining',
      timeStart: '12:30',
      timeEnd: '14:00',
      duration: '1h 30m',
      cost: 25,
      currency,
      locationName: `${dest} Gastronomy Quarter`,
      notes: 'Sample traditional regional specialties and refreshing local beverages.',
      priority: 'must-do',
    },
    {
      title: `Main Heritage Museum & Art Gallery Tour`,
      category: 'culture',
      timeStart: '14:30',
      timeEnd: '16:30',
      duration: '2h',
      cost: 18,
      currency,
      locationName: `${dest} National / City Museum`,
      notes: 'Admire permanent collections, regional history, and curated exhibitions.',
      priority: 'recommended',
    },
    {
      title: `Scenic Sunset Promenade & Lookout Point`,
      category: 'outdoor',
      timeStart: '17:30',
      timeEnd: '19:00',
      duration: '1h 30m',
      cost: 0,
      currency,
      locationName: `${dest} Panoramic Viewpoint`,
      notes: 'Golden hour vantage point with panoramic views over the skyline or coastline.',
      priority: 'must-do',
    },
    {
      title: `Explore Central Market & Local Artisan Stalls`,
      category: 'shopping',
      timeStart: '10:00',
      timeEnd: '12:00',
      duration: '2h',
      cost: 20,
      currency,
      locationName: `${dest} Municipal Market`,
      notes: 'Browse organic produce, handcrafted souvenirs, spices, and baked goods.',
      priority: 'recommended',
    },
  ];
}
