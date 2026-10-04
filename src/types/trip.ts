export type TravelStyle =
  | 'cultural'
  | 'relaxed'
  | 'foodie'
  | 'adventure'
  | 'romantic'
  | 'budget'
  | 'luxury';

export type TravelerType = 'solo' | 'couple' | 'friends' | 'family';

export type ActivityCategory =
  | 'sightseeing'
  | 'dining'
  | 'transport'
  | 'stay'
  | 'outdoor'
  | 'culture'
  | 'shopping'
  | 'relaxation';

export type ActivityStatus = 'planned' | 'booked' | 'completed';

export type ActivityPriority = 'must-do' | 'recommended' | 'optional';

export interface ActivityItem {
  id: string;
  columnId: string; // 'backlog' or day column id
  title: string;
  category: ActivityCategory;
  timeStart?: string;
  timeEnd?: string;
  duration?: string;
  cost: number;
  currency: string;
  locationName: string;
  locationAddress?: string;
  locationUrl?: string;
  notes?: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  tags?: string[];
  order: number;
}

export interface DayColumn {
  id: string;
  tripId: string;
  dayIndex: number; // 1 for Day 1, etc.
  date: string; // YYYY-MM-DD
  title: string;
  theme?: string;
  weather?: {
    temp: string;
    condition: string;
  };
}

export interface PackingItem {
  id: string;
  tripId: string;
  item: string;
  category: string;
  packed: boolean;
}

export interface Trip {
  id: string;
  title: string;
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
  notes?: string;
  createdAt: number;
}

export interface DestinationPreset {
  id: string;
  destination: string;
  country: string;
  flag: string;
  coverImage: string;
  description: string;
  suggestedDays: number;
  averageDailyCost: number;
  currency: string;
  suggestedStyle: TravelStyle;
  days: {
    title: string;
    theme: string;
    activities: Omit<ActivityItem, 'id' | 'columnId' | 'order'>[];
  }[];
  backlog: Omit<ActivityItem, 'id' | 'columnId' | 'order'>[];
}
