import React, { useState, useEffect } from 'react';
import { Trip, DayColumn, ActivityItem, PackingItem } from './types/trip';
import {
  initializeSampleData,
  saveTripsToStorage,
  saveColumnsToStorage,
  saveActivitiesToStorage,
  savePackingToStorage,
  saveActiveTripIdToStorage,
} from './utils/storage';
import { Navbar, ActiveView } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { KanbanBoard } from './components/KanbanBoard';
import { TimelineView } from './components/TimelineView';
import { BudgetTrackerView } from './components/BudgetTrackerView';
import { PackingChecklistView } from './components/PackingChecklistView';
import { ActivityModal } from './components/ActivityModal';
import { EditDayModal } from './components/EditDayModal';
import { TripSettingsModal } from './components/TripSettingsModal';
import { ExportModal } from './components/ExportModal';
import { createInitialPackingList } from './data/packing';

export default function App() {
  // Theme state (Dark / Light)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('wanderkanban_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to root document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wanderkanban_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wanderkanban_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Main loaded dataset
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string>('');
  const [allColumns, setAllColumns] = useState<DayColumn[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [allPacking, setAllPacking] = useState<PackingItem[]>([]);

  // Default view starts on the new Home Page
  const [activeView, setActiveView] = useState<ActiveView>('home');

  // Modal dialog states
  const [isActivityModalOpen, setIsActivityModalOpen] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [activityDefaultCol, setActivityDefaultCol] = useState<string>('backlog');

  const [isEditDayModalOpen, setIsEditDayModalOpen] = useState<boolean>(false);
  const [editingDayColumn, setEditingDayColumn] = useState<DayColumn | null>(null);

  const [isTripSettingsOpen, setIsTripSettingsOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    const init = initializeSampleData();
    setAllTrips(init.trips);
    setActiveTripId(init.activeTripId);
    setAllColumns(init.columns);
    setAllActivities(init.activities);
    setAllPacking(init.packing);
  }, []);

  // Current active trip
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

  const currentPacking = allPacking.filter((p) => p.tripId === (currentTrip ? currentTrip.id : ''));

  // Switch trip handler
  const handleSelectTrip = (tripId: string) => {
    setActiveTripId(tripId);
    saveActiveTripIdToStorage(tripId);
  };

  // Home Page: Plan a new trip with EMPTY columns (user request: "make empty column in kanban")
  const handlePlanTripFromHome = (tripData: {
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
    travelerType: any;
    travelStyle: any;
    title: string;
  }) => {
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

    // Generate EMPTY day columns for Day 1, Day 2 ... Day N
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

    // Set updated state
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

    // Switch directly into the Kanban board
    setActiveView('kanban');
  };

  // Activity handlers
  const handleOpenAddActivity = (columnId: string) => {
    setEditingActivity(null);
    setActivityDefaultCol(columnId);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (activity: ActivityItem) => {
    setEditingActivity(activity);
    setActivityDefaultCol(activity.columnId);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (
    activityData: Omit<ActivityItem, 'id' | 'order'> & { id?: string }
  ) => {
    if (activityData.id) {
      // Update existing
      const updated = allActivities.map((a) =>
        a.id === activityData.id ? { ...a, ...activityData } : a
      );
      setAllActivities(updated);
      saveActivitiesToStorage(updated);
    } else {
      // Create new
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

  const handleDeleteActivity = (activityId: string) => {
    const updated = allActivities.filter((a) => a.id !== activityId);
    setAllActivities(updated);
    saveActivitiesToStorage(updated);
  };

  const handleToggleActivityStatus = (activityId: string) => {
    const updated = allActivities.map((a) => {
      if (a.id !== activityId) return a;
      const nextStatus =
        a.status === 'planned' ? 'booked' : a.status === 'booked' ? 'completed' : 'planned';
      return { ...a, status: nextStatus as any };
    });
    setAllActivities(updated);
    saveActivitiesToStorage(updated);
  };

  const handleMoveActivity = (activityId: string, targetColId: string) => {
    const updated = allActivities.map((a) =>
      a.id === activityId ? { ...a, columnId: targetColId } : a
    );
    setAllActivities(updated);
    saveActivitiesToStorage(updated);
  };

  const handleQuickAddIdea = (title: string) => {
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

  // Day columns handlers
  const handleAddDay = () => {
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

    // Update trip duration
    const updatedTrips = allTrips.map((t) =>
      t.id === currentTrip.id ? { ...t, numberOfDays: t.numberOfDays + 1 } : t
    );
    setAllTrips(updatedTrips);
    saveTripsToStorage(updatedTrips);
  };

  const handleOpenEditDay = (column: DayColumn) => {
    setEditingDayColumn(column);
    setIsEditDayModalOpen(true);
  };

  const handleSaveDay = (columnId: string, updates: Partial<DayColumn>) => {
    const updatedCols = allColumns.map((c) =>
      c.id === columnId ? { ...c, ...updates } : c
    );
    setAllColumns(updatedCols);
    saveColumnsToStorage(updatedCols);
  };

  const handleDeleteDay = (columnId: string) => {
    if (!window.confirm('Delete this day column? Any activities inside will be moved to Backlog.')) {
      return;
    }

    // Move activities in this day to backlog
    const updatedActs = allActivities.map((a) =>
      a.columnId === columnId ? { ...a, columnId: 'backlog' } : a
    );
    setAllActivities(updatedActs);
    saveActivitiesToStorage(updatedActs);

    // Remove column and re-index remaining days
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

  // Trip settings handlers
  const handleUpdateTrip = (updatedTrip: Trip) => {
    const updated = allTrips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t));
    setAllTrips(updated);
    saveTripsToStorage(updated);
  };

  const handleDeleteTrip = (tripId: string) => {
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
      setActiveView('home');
    }
  };

  // Packing checklist handlers
  const handleTogglePacked = (itemId: string) => {
    const updated = allPacking.map((p) =>
      p.id === itemId ? { ...p, packed: !p.packed } : p
    );
    setAllPacking(updated);
    savePackingToStorage(updated);
  };

  const handleAddPackingItem = (item: string, category: string) => {
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

  const handleDeletePackingItem = (itemId: string) => {
    const updated = allPacking.filter((p) => p.id !== itemId);
    setAllPacking(updated);
    savePackingToStorage(updated);
  };

  const handleResetDefaultPacking = () => {
    if (!currentTrip) return;
    const defaults = createInitialPackingList(currentTrip.id);
    const otherPacking = allPacking.filter((p) => p.tripId !== currentTrip.id);
    const updated = [...otherPacking, ...defaults];
    setAllPacking(updated);
    savePackingToStorage(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-150">
      {/* Top Bar Navigation */}
      <Navbar
        currentTrip={currentTrip}
        allTrips={allTrips}
        activeView={activeView}
        onViewChange={setActiveView}
        onSelectTrip={handleSelectTrip}
        onOpenNewTrip={() => setActiveView('home')}
        onOpenTripSettings={() => setIsTripSettingsOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {activeView === 'home' ? (
          <HomePage
            onPlanTrip={handlePlanTripFromHome}
            savedTrips={allTrips}
            onSelectSavedTrip={(tripId) => {
              handleSelectTrip(tripId);
              setActiveView('kanban');
            }}
          />
        ) : !currentTrip ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md text-center space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">No active trips found</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Search a destination on the home page to create your Kanban itinerary.
              </p>
              <button
                onClick={() => setActiveView('home')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                Go to Home & Plan Trip
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeView === 'kanban' && (
              <KanbanBoard
                trip={currentTrip}
                columns={currentColumns}
                activities={currentActivities}
                onAddActivity={handleOpenAddActivity}
                onEditActivity={handleOpenEditActivity}
                onDeleteActivity={handleDeleteActivity}
                onToggleActivityStatus={handleToggleActivityStatus}
                onMoveActivity={handleMoveActivity}
                onAddDay={handleAddDay}
                onEditDay={handleOpenEditDay}
                onDeleteDay={handleDeleteDay}
                onQuickAddIdea={handleQuickAddIdea}
              />
            )}

            {activeView === 'timeline' && (
              <TimelineView
                trip={currentTrip}
                columns={currentColumns}
                activities={currentActivities}
                onAddActivity={handleOpenAddActivity}
                onEditActivity={handleOpenEditActivity}
                onToggleStatus={handleToggleActivityStatus}
              />
            )}

            {activeView === 'budget' && (
              <BudgetTrackerView
                trip={currentTrip}
                columns={currentColumns}
                activities={currentActivities}
              />
            )}

            {activeView === 'packing' && (
              <PackingChecklistView
                trip={currentTrip}
                packingItems={currentPacking}
                onTogglePacked={handleTogglePacked}
                onAddItem={handleAddPackingItem}
                onDeleteItem={handleDeletePackingItem}
                onResetDefault={handleResetDefaultPacking}
              />
            )}
          </>
        )}
      </main>

      {/* MODALS */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        initialActivity={editingActivity}
        columns={currentColumns}
        defaultColumnId={activityDefaultCol}
        currency={currentTrip ? currentTrip.currency : 'USD'}
        destinationName={currentTrip ? currentTrip.destination : 'Destination'}
      />

      <EditDayModal
        isOpen={isEditDayModalOpen}
        onClose={() => setIsEditDayModalOpen(false)}
        column={editingDayColumn}
        onSave={handleSaveDay}
      />

      {currentTrip && (
        <>
          <TripSettingsModal
            isOpen={isTripSettingsOpen}
            onClose={() => setIsTripSettingsOpen(false)}
            trip={currentTrip}
            onUpdateTrip={handleUpdateTrip}
            onDeleteTrip={handleDeleteTrip}
          />

          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            trip={currentTrip}
            columns={currentColumns}
            activities={currentActivities}
          />
        </>
      )}
    </div>
  );
}
