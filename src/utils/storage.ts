import { Trip, DayColumn, ActivityItem, PackingItem } from '../types/trip';
import { CURATED_DESTINATIONS } from '../data/destinations';
import { createInitialPackingList } from '../data/packing';

const STORAGE_KEYS = {
  TRIPS: 'wanderkanban_trips',
  ACTIVE_TRIP_ID: 'wanderkanban_active_trip_id',
  COLUMNS: 'wanderkanban_columns',
  ACTIVITIES: 'wanderkanban_activities',
  PACKING: 'wanderkanban_packing',
  HAS_ONBOARDED: 'wanderkanban_has_onboarded',
};

// Seed initial trip if none exists
export function initializeSampleData(): {
  trips: Trip[];
  activeTripId: string;
  columns: DayColumn[];
  activities: ActivityItem[];
  packing: PackingItem[];
  needsOnboarding: boolean;
} {
  try {
    const rawTrips = localStorage.getItem(STORAGE_KEYS.TRIPS);
    const hasOnboarded = localStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED);

    if (rawTrips && JSON.parse(rawTrips).length > 0) {
      const trips = JSON.parse(rawTrips) as Trip[];
      const activeTripId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP_ID) || trips[0].id;
      const columns = JSON.parse(localStorage.getItem(STORAGE_KEYS.COLUMNS) || '[]') as DayColumn[];
      const activities = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]') as ActivityItem[];
      const packing = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACKING) || '[]') as PackingItem[];

      return {
        trips,
        activeTripId,
        columns,
        activities,
        packing,
        needsOnboarding: !hasOnboarded,
      };
    }
  } catch (err) {
    console.error('Error reading localStorage:', err);
  }

  // Pre-seed with Kyoto preset as initial demonstration
  const kyotoPreset = CURATED_DESTINATIONS[0];
  const tripId = 'trip-kyoto-sample';
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 12);
  const endDate = new Date(nextMonth);
  endDate.setDate(endDate.getDate() + kyotoPreset.suggestedDays - 1);

  const initialTrip: Trip = {
    id: tripId,
    title: 'Kyoto Zen Temples & Heritage Escapade',
    destination: kyotoPreset.destination,
    country: kyotoPreset.country,
    flag: kyotoPreset.flag,
    coverImage: kyotoPreset.coverImage,
    startDate: nextMonth.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    numberOfDays: kyotoPreset.suggestedDays,
    budget: 1800,
    currency: 'USD',
    travelersCount: 2,
    travelerType: 'couple',
    travelStyle: 'cultural',
    notes: 'Spring season trip focusing on historic architecture, matcha tea experiences, and local Kaiseki dining.',
    createdAt: Date.now(),
  };

  const initialColumns: DayColumn[] = kyotoPreset.days.map((d, index) => {
    const dDate = new Date(nextMonth);
    dDate.setDate(dDate.getDate() + index);
    return {
      id: `col-${tripId}-day-${index + 1}`,
      tripId,
      dayIndex: index + 1,
      date: dDate.toISOString().split('T')[0],
      title: `Day ${index + 1}: ${d.title}`,
      theme: d.theme,
      weather: {
        temp: `${20 + (index % 4)}°C`,
        condition: index % 2 === 0 ? 'Sunny & Clear' : 'Partly Cloudy',
      },
    };
  });

  const initialActivities: ActivityItem[] = [];
  let actId = 1;

  // Add day activities
  kyotoPreset.days.forEach((day, dayIdx) => {
    const colId = initialColumns[dayIdx].id;
    day.activities.forEach((act, actIdx) => {
      initialActivities.push({
        ...act,
        id: `act-${tripId}-${actId++}`,
        columnId: colId,
        order: actIdx,
      });
    });
  });

  // Add backlog activities
  kyotoPreset.backlog.forEach((act, actIdx) => {
    initialActivities.push({
      ...act,
      id: `act-${tripId}-${actId++}`,
      columnId: 'backlog',
      order: actIdx,
    });
  });

  const initialPacking = createInitialPackingList(tripId);

  const trips = [initialTrip];
  const columns = initialColumns;
  const activities = initialActivities;
  const packing = initialPacking;

  try {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, tripId);
    localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    localStorage.setItem(STORAGE_KEYS.PACKING, JSON.stringify(packing));
    // Notice: if user hasn't explicitly onboarded, we can prompt them or show prompt
  } catch (err) {
    console.error('Error seeding localStorage:', err);
  }

  return {
    trips,
    activeTripId: tripId,
    columns,
    activities,
    packing,
    needsOnboarding: false, // If first time, we can show a welcome banner or offer to start their own trip!
  };
}

export function saveTripsToStorage(trips: Trip[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  } catch (err) {
    console.error(err);
  }
}

export function saveColumnsToStorage(columns: DayColumn[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
  } catch (err) {
    console.error(err);
  }
}

export function saveActivitiesToStorage(activities: ActivityItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (err) {
    console.error(err);
  }
}

export function savePackingToStorage(packing: PackingItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PACKING, JSON.stringify(packing));
  } catch (err) {
    console.error(err);
  }
}

export function saveActiveTripIdToStorage(tripId: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, tripId);
  } catch (err) {
    console.error(err);
  }
}

export function setHasOnboarded(val: boolean) {
  try {
    localStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, val ? 'true' : 'false');
  } catch (err) {
    console.error(err);
  }
}
