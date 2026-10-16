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
      let trips = JSON.parse(rawTrips) as Trip[];
      let columns = JSON.parse(localStorage.getItem(STORAGE_KEYS.COLUMNS) || '[]') as DayColumn[];
      let activities = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]') as ActivityItem[];
      let packing = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACKING) || '[]') as PackingItem[];

      // Check if user has Indian destination options in their saved list; if only Kyoto existed, seed Goa and Jaipur
      const hasIndianTrip = trips.some((t) => t.country === 'India' || t.destination === 'Goa' || t.destination === 'Jaipur');
      if (!hasIndianTrip) {
        const goaPreset = CURATED_DESTINATIONS.find((d) => d.id === 'goa');
        if (goaPreset) {
          const goaTripId = 'trip-goa-sample';
          const now = new Date();
          const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + goaPreset.suggestedDays - 1);

          const goaTrip: Trip = {
            id: goaTripId,
            title: 'Goa Sun, Sand & Portuguese Heritage',
            destination: goaPreset.destination,
            country: goaPreset.country,
            flag: goaPreset.flag,
            coverImage: goaPreset.coverImage,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            numberOfDays: goaPreset.suggestedDays,
            budget: 35000,
            currency: 'INR',
            travelersCount: 2,
            travelerType: 'couple',
            travelStyle: 'relaxed',
            notes: 'Beach hopping from Anjuna to Palolem, Chapora sunset, Fontainhas heritage walk, and fresh Goan seafood.',
            createdAt: Date.now(),
          };

          const goaColumns: DayColumn[] = goaPreset.days.map((d, index) => {
            const dDate = new Date(startDate);
            dDate.setDate(dDate.getDate() + index);
            return {
              id: `col-${goaTripId}-day-${index + 1}`,
              tripId: goaTripId,
              dayIndex: index + 1,
              date: dDate.toISOString().split('T')[0],
              title: `Day ${index + 1}: ${d.title}`,
              theme: d.theme,
              weather: {
                temp: `${29 + (index % 3)}°C`,
                condition: index % 2 === 0 ? 'Sunny & Warm' : 'Tropical Breeze',
              },
            };
          });

          const goaActivities: ActivityItem[] = [];
          let actId = 1;
          goaPreset.days.forEach((day, dayIdx) => {
            const colId = goaColumns[dayIdx].id;
            day.activities.forEach((act, actIdx) => {
              goaActivities.push({
                ...act,
                id: `act-${goaTripId}-${actId++}`,
                columnId: colId,
                order: actIdx,
              });
            });
          });
          goaPreset.backlog.forEach((act, actIdx) => {
            goaActivities.push({
              ...act,
              id: `act-${goaTripId}-${actId++}`,
              columnId: 'backlog',
              order: actIdx,
            });
          });

          const goaPacking = createInitialPackingList(goaTripId);

          trips = [goaTrip, ...trips];
          columns = [...goaColumns, ...columns];
          activities = [...goaActivities, ...activities];
          packing = [...goaPacking, ...packing];

          localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
          localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, goaTripId);
          localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
          localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
          localStorage.setItem(STORAGE_KEYS.PACKING, JSON.stringify(packing));
        }
      }

      const activeTripId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP_ID) || trips[0].id;

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

  // Pre-seed with Goa as initial demonstration in INR
  const goaPreset = CURATED_DESTINATIONS.find((d) => d.id === 'goa') || CURATED_DESTINATIONS[0];
  const tripId = 'trip-goa-sample';
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + goaPreset.suggestedDays - 1);

  const initialTrip: Trip = {
    id: tripId,
    title: 'Goa Sun, Sand & Portuguese Heritage',
    destination: goaPreset.destination,
    country: goaPreset.country,
    flag: goaPreset.flag,
    coverImage: goaPreset.coverImage,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    numberOfDays: goaPreset.suggestedDays,
    budget: 35000,
    currency: 'INR',
    travelersCount: 2,
    travelerType: 'couple',
    travelStyle: 'relaxed',
    notes: 'Beach hopping from Anjuna to Palolem, Chapora sunset, Fontainhas heritage walk, and fresh Goan seafood.',
    createdAt: Date.now(),
  };

  const initialColumns: DayColumn[] = goaPreset.days.map((d, index) => {
    const dDate = new Date(startDate);
    dDate.setDate(dDate.getDate() + index);
    return {
      id: `col-${tripId}-day-${index + 1}`,
      tripId,
      dayIndex: index + 1,
      date: dDate.toISOString().split('T')[0],
      title: `Day ${index + 1}: ${d.title}`,
      theme: d.theme,
      weather: {
        temp: `${29 + (index % 3)}°C`,
        condition: index % 2 === 0 ? 'Sunny & Warm' : 'Tropical Breeze',
      },
    };
  });

  const initialActivities: ActivityItem[] = [];
  let actId = 1;

  // Add day activities
  goaPreset.days.forEach((day, dayIdx) => {
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
  goaPreset.backlog.forEach((act, actIdx) => {
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
