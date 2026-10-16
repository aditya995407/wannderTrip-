import React, { useState } from 'react';
import { Navbar, ActiveView } from './components/layout';
import { HomePage } from './components/home';
import { KanbanBoard } from './components/kanban';
import { TimelineView, BudgetTrackerView, PackingChecklistView } from './components/views';
import { LoginPage } from './components/auth';
import { ActivityModal, EditDayModal, TripSettingsModal, ExportModal } from './components/modals';

import { useTheme, useAuthSession, useTripManager } from './hooks';
import { ActivityItem, DayColumn } from './types/trip';

export default function App() {
  // Theme management (Dark / Light)
  const { isDarkMode, toggleTheme } = useTheme();

  // Authentication session
  const { authUser, handleLoginSuccess, handleLogout } = useAuthSession();

  // Centralized Trip data and actions
  const tripManager = useTripManager();
  const {
    allTrips,
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
  } = tripManager;

  // Active navigation view (default: 'home')
  const [activeView, setActiveView] = useState<ActiveView>('home');

  // Modal Dialog UI state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [activityDefaultCol, setActivityDefaultCol] = useState<string>('backlog');

  const [isEditDayModalOpen, setIsEditDayModalOpen] = useState<boolean>(false);
  const [editingDayColumn, setEditingDayColumn] = useState<DayColumn | null>(null);

  const [isTripSettingsOpen, setIsTripSettingsOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Handlers for Activity Modal
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

  // Handler for Day Modal
  const handleOpenEditDay = (column: DayColumn) => {
    setEditingDayColumn(column);
    setIsEditDayModalOpen(true);
  };

  // Home Page Trip Creation
  const handlePlanTrip = (tripData: any) => {
    planTripFromHome(tripData);
    setActiveView('kanban');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-150">
      {/* Top Bar Navigation */}
      <Navbar
        currentTrip={currentTrip}
        allTrips={allTrips}
        activeView={activeView}
        onViewChange={setActiveView}
        onSelectTrip={selectTrip}
        onOpenNewTrip={() => setActiveView('home')}
        onOpenTripSettings={() => setIsTripSettingsOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        authUser={authUser}
        onOpenLogin={() => setActiveView('login')}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {activeView === 'login' ? (
          <LoginPage
            onLoginSuccess={(user, token) => {
              handleLoginSuccess(user, token);
              setActiveView('home');
            }}
            onCancel={() => setActiveView('home')}
          />
        ) : activeView === 'home' ? (
          <HomePage
            onPlanTrip={handlePlanTrip}
            savedTrips={allTrips}
            onSelectSavedTrip={(tripId) => {
              selectTrip(tripId);
              setActiveView('kanban');
            }}
            authUser={authUser}
            onOpenLogin={() => setActiveView('login')}
          />
        ) : !currentTrip ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md text-center space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                No active trips found
              </h2>
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
                onDeleteActivity={deleteActivity}
                onToggleActivityStatus={toggleActivityStatus}
                onMoveActivity={moveActivity}
                onAddDay={addDay}
                onEditDay={handleOpenEditDay}
                onDeleteDay={deleteDay}
                onQuickAddIdea={quickAddIdea}
              />
            )}

            {activeView === 'timeline' && (
              <TimelineView
                trip={currentTrip}
                columns={currentColumns}
                activities={currentActivities}
                onAddActivity={handleOpenAddActivity}
                onEditActivity={handleOpenEditActivity}
                onToggleStatus={toggleActivityStatus}
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
                onTogglePacked={togglePacked}
                onAddItem={addPackingItem}
                onDeleteItem={deletePackingItem}
                onResetDefault={resetDefaultPacking}
              />
            )}
          </>
        )}
      </main>

      {/* Activity Creation & Editing Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={saveActivity}
        initialActivity={editingActivity}
        columns={currentColumns}
        defaultColumnId={activityDefaultCol}
        currency={currentTrip ? currentTrip.currency : 'USD'}
        destinationName={currentTrip ? currentTrip.destination : 'Destination'}
      />

      {/* Day Column Customizer Modal */}
      <EditDayModal
        isOpen={isEditDayModalOpen}
        onClose={() => setIsEditDayModalOpen(false)}
        column={editingDayColumn}
        onSave={saveDay}
      />

      {/* Trip Settings & Export Modals */}
      {currentTrip && (
        <>
          <TripSettingsModal
            isOpen={isTripSettingsOpen}
            onClose={() => setIsTripSettingsOpen(false)}
            trip={currentTrip}
            onUpdateTrip={updateTrip}
            onDeleteTrip={(id) => {
              deleteTrip(id);
              if (allTrips.length <= 1) setActiveView('home');
            }}
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
