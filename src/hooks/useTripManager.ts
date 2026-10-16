import { useState, useEffect } from 'react';
import { Trip, DayColumn, ActivityItem, PackingItem, TravelerType, TravelStyle } from '../types/trip';
import {
  initializeSampleData,
  saveTripsToStorage,
  saveColumnsToStorage,
  saveActivitiesToStorage,
  savePackingToStorage,
  saveActiveTripIdToStorage,
} from '../utils/storage';
import { createInitialPackingList } from '../data/packing';

export interface NewTripPayload {
  destination: string;
  country: string;
  flag: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  budget: number;
  currency: string;
  travelersCount: number;
  travelerType: TravelerType;
  travelStyle: TravelStyle;
  title: string;
}

export function useTripManager() {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string>('');
  const [allColumns, setAllColumns] = useState<DayColumn[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [allPacking, setAllPacking] = useState<PackingItem[]>([]);

  // Initialize data on mount from local storage
  useEffect(() => {
    const init = initializeSampleData();
    setAllTrips(init.trips);
    setActiveTripId(init.activeTripId);
    setAllColumns(init.columns);
    setAllActivities(init.activities);
    setAllPacking(init.packing);
  }, []);

  // Derived current active trip
  const currentTrip = allTrips.find((t) => t.id === activeTripId) || allTrips[0] || null;

  // Filter columns, activities, and packing for the active trip
  const currentColumns = allColumns
    .filter((c) => c.tripId === (currentTrip ? currentTrip.id : ''))
    .sort((a, b) => a.dayIndex - b.dayIndex);

  const currentActivities = allActivities.filter((a) => {
    if (a.columnId === 'backlog') {
      return !a.id.includes('trip-') || a.id.includes(`act-${currentTrip?.id}`);
    }
    return currentColumns.some((col) => col.id === a.columnId);
  });

  const currentPacking = allPacking.filter(
    (p) => p.tripId === (currentTrip ? currentTrip.id : '')
  );

  const selectTrip = (tripId: string) => {
    setActiveTripId(tripId);
    saveActiveTripIdToStorage(tripId);
  };

  const planTripFromHome = (tripData: NewTripPayload) => {
    const tripId = `trip-${Date.now()}`;
    const newTrip: Trip = {
      id: tripId,
      title: tripData.title,
      destination: tripData.destination,
      country: tripData.country,
      flag: tripData.flag,
      coverImage: tripData.coverImage,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      numberOfDays: tripData.numberOfDays,
      budget: tripData.budget,
      currency: tripData.currency,
      travelersCount: tripData.travelersCount,
      travelerType: tripData.travelerType,
      travelStyle: tripData.travelStyle,
      createdAt: Date.now(),
    };

    // Generate empty day columns
    const start = new Date(tripData.startDate);
    const newCols: DayColumn[] = [];

    for (let i = 0; i < tripData.numberOfDays; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(dayDate.getDate() + i);

      newCols.push({
        id: `col-${tripId}-day-${i + 1}`,
        tripId,
        dayIndex: i + 1,
        date: dayDate.toISOString().split('T')[0],
        title: `Day ${i + 1}: Exploration & Highlights`,
        theme: `Planned activities for day ${i + 1}`,
        weather: {
          temp: '22°C',
          condition: 'Clear Sky',
        },
      });
    }

    const updatedTrips = [newTrip, ...allTrips];
    const updatedColumns = [...allColumns, ...newCols];
    const newPacking = createInitialPackingList(tripId);
    const updatedPacking = [...allPacking, ...newPacking];

    setAllTrips(updatedTrips);
    setActiveTripId(tripId);
    setAllColumns(updatedColumns);
    setAllPacking(updatedPacking);

    saveTripsToStorage(updatedTrips);
    saveActiveTripIdToStorage(tripId);
    saveColumnsToStorage(updatedColumns);
    savePackingToStorage(updatedPacking);
  };

  const saveActivity = (
    activityData: Omit<ActivityItem, 'id' | 'order'> & { id?: string }
  ) => {
    if (activityData.id) {
      const updated = allActivities.map((a) =>
        a.id === activityData.id ? { ...a, ...activityData } : a
      );
      setAllActivities(updated);
      saveActivitiesToStorage(updated);
    } else {
      const newAct: ActivityItem = {
        ...activityData,
        id: `act-${currentTrip?.id || 'gen'}-${Date.now()}`,
        order: 999,
      };
      const updated = [...allActivities, newAct];
      setAllActivities(updated);
      saveActivitiesToStorage(updated);
    }
  };

  const deleteActivity = (activityId: string) => {
    const updated = allActivities.filter((a) => a.id !== activityId);
    setAllActivities(updated);
    saveActivitiesToStorage(updated);
  };

  const toggleActivityStatus = (activityId: string) => {
    const updated = allActivities.map((a) => {
      if (a.id !== activityId) return a;
      const nextStatus =
        a.status === 'planned' ? 'booked' : a.status === 'booked' ? 'completed' : 'planned';
      return { ...a, status: nextStatus as any };
    });
    setAllActivities(updated);
    saveActivitiesToStorage(updated);
  };

  const moveActivity = (activityId: string, targetColId: string) => {
    const updated = allActivities.map((a) =>
      a.id === activityId ? { ...a, columnId: targetColId } : a
    );
    setAllActivities(updated);
    saveActivitiesToStorage(updated);
  };

  const quickAddIdea = (title: string) => {
    if (!currentTrip) return;
    const newAct: ActivityItem = {
      id: `act-${currentTrip.id}-${Date.now()}`,
      columnId: 'backlog',
      title,
      category: 'sightseeing',
      cost: 0,
      currency: currentTrip.currency,
      locationName: currentTrip.destination,
      status: 'planned',
      priority: 'recommended',
      order: 999,
    };
    const updated = [...allActivities, newAct];
    setAllActivities(updated);
    saveActivitiesToStorage(updated);
  };

  const addDay = () => {
    if (!currentTrip) return;
    const nextIndex = currentColumns.length + 1;

    let newDate = '';
    if (currentColumns.length > 0) {
      const lastCol = currentColumns[currentColumns.length - 1];
      if (lastCol.date) {
        const d = new Date(lastCol.date);
        d.setDate(d.getDate() + 1);
        newDate = d.toISOString().split('T')[0];
      }
    }

    const newCol: DayColumn = {
      id: `col-${currentTrip.id}-day-${nextIndex}`,
      tripId: currentTrip.id,
      dayIndex: nextIndex,
      date: newDate,
      title: `Day ${nextIndex}: Exploration & Highlights`,
      theme: 'Flexible Itinerary & Leisure',
      weather: {
        temp: '21°C',
        condition: 'Clear Sky',
      },
    };

    const updatedCols = [...allColumns, newCol];
    setAllColumns(updatedCols);
    saveColumnsToStorage(updatedCols);

    const updatedTrips = allTrips.map((t) =>
      t.id === currentTrip.id ? { ...t, numberOfDays: t.numberOfDays + 1 } : t
    );
    setAllTrips(updatedTrips);
    saveTripsToStorage(updatedTrips);
  };

  const saveDay = (columnId: string, updates: Partial<DayColumn>) => {
    const updatedCols = allColumns.map((c) =>
      c.id === columnId ? { ...c, ...updates } : c
    );
    setAllColumns(updatedCols);
    saveColumnsToStorage(updatedCols);
  };

  const deleteDay = (columnId: string) => {
    if (!window.confirm('Delete this day column? Any activities inside will be moved to Backlog.')) {
      return;
    }

    const updatedActs = allActivities.map((a) =>
      a.columnId === columnId ? { ...a, columnId: 'backlog' } : a
    );
    setAllActivities(updatedActs);
    saveActivitiesToStorage(updatedActs);

    const remainingInTrip = currentColumns.filter((c) => c.id !== columnId);
    const reindexedInTrip = remainingInTrip.map((c, i) => ({
      ...c,
      dayIndex: i + 1,
      title: c.title.replace(/^Day \d+:/, `Day ${i + 1}:`),
    }));

    const otherTripCols = allColumns.filter((c) => c.tripId !== currentTrip?.id);
    const finalCols = [...otherTripCols, ...reindexedInTrip];
    setAllColumns(finalCols);
    saveColumnsToStorage(finalCols);

    if (currentTrip) {
      const updatedTrips = allTrips.map((t) =>
        t.id === currentTrip.id ? { ...t, numberOfDays: Math.max(1, t.numberOfDays - 1) } : t
      );
      setAllTrips(updatedTrips);
      saveTripsToStorage(updatedTrips);
    }
  };

  const updateTrip = (updatedTrip: Trip) => {
    const updated = allTrips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t));
    setAllTrips(updated);
    saveTripsToStorage(updated);
  };

  const deleteTrip = (tripId: string) => {
    const remainingTrips = allTrips.filter((t) => t.id !== tripId);
    const remainingCols = allColumns.filter((c) => c.tripId !== tripId);
    const remainingActs = allActivities.filter((a) => !a.id.includes(`act-${tripId}`));
    const remainingPacking = allPacking.filter((p) => p.tripId !== tripId);

    setAllTrips(remainingTrips);
    setAllColumns(remainingCols);
    setAllActivities(remainingActs);
    setAllPacking(remainingPacking);

    saveTripsToStorage(remainingTrips);
    saveColumnsToStorage(remainingCols);
    saveActivitiesToStorage(remainingActs);
    savePackingToStorage(remainingPacking);

    if (remainingTrips.length > 0) {
      setActiveTripId(remainingTrips[0].id);
      saveActiveTripIdToStorage(remainingTrips[0].id);
    } else {
      setActiveTripId('');
    }
  };

  const togglePacked = (itemId: string) => {
    const updated = allPacking.map((p) =>
      p.id === itemId ? { ...p, packed: !p.packed } : p
    );
    setAllPacking(updated);
    savePackingToStorage(updated);
  };

  const addPackingItem = (item: string, category: string) => {
    if (!currentTrip) return;
    const newItem: PackingItem = {
      id: `pack-${currentTrip.id}-${Date.now()}`,
      tripId: currentTrip.id,
      item,
      category,
      packed: false,
    };
    const updated = [...allPacking, newItem];
    setAllPacking(updated);
    savePackingToStorage(updated);
  };

  const deletePackingItem = (itemId: string) => {
    const updated = allPacking.filter((p) => p.id !== itemId);
    setAllPacking(updated);
    savePackingToStorage(updated);
  };

  const resetDefaultPacking = () => {
    if (!currentTrip) return;
    const defaults = createInitialPackingList(currentTrip.id);
    const otherPacking = allPacking.filter((p) => p.tripId !== currentTrip.id);
    const updated = [...otherPacking, ...defaults];
    setAllPacking(updated);
    savePackingToStorage(updated);
  };

  return {
    allTrips,
    activeTripId,
    currentTrip,
    currentColumns,
    currentActivities,
    currentPacking,
    selectTrip,
    planTripFromHome,
    saveActivity,
    deleteActivity,
    toggleActivityStatus,
    moveActivity,
    quickAddIdea,
    addDay,
    saveDay,
    deleteDay,
    updateTrip,
    deleteTrip,
    togglePacked,
    addPackingItem,
    deletePackingItem,
    resetDefaultPacking,
  };
}
