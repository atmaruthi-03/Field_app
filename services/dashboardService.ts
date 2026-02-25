/**
 * Service for fetching site intelligence and weather data for the dashboard.
 */

export interface DashboardStats {
    reliability: number;
    reliabilityTrend: string;
    tasksDone: number;
    tasksTotal: number;
    pendingCount: number;
    highPriorityPending: number;
    openRfis: number;
    safetyPulse: 'Good' | 'Attention' | 'Critical';
    activeStaff: number;
}

import Config from '../constants/Config';

const BASE_URL = Config.API.BASE_URL;

export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    advice: string;
}

export interface ActivityEvent {
    time: string;
    label: string;
    status: 'done' | 'pending' | 'upcoming';
}

/**
 * Mock API to simulate fetching site metrics.
 */
export async function fetchDashboardStatsApi(): Promise<DashboardStats> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        reliability: 78.4,
        reliabilityTrend: '+2.1% from last week',
        tasksDone: 14,
        tasksTotal: 20,
        pendingCount: 5,
        highPriorityPending: 3,
        openRfis: 3,
        safetyPulse: 'Good',
        activeStaff: 42
    };
}

/**
 * Mock API to simulate fetching weather data.
 */
export async function fetchWeatherApi(): Promise<WeatherData> {
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
        temp: 28,
        condition: 'Clear Skies',
        icon: 'sunny-outline',
        advice: 'Excellent for concrete pour and outdoor site work today.'
    };
}

/**
 * Mock API to simulate fetching activity feed.
 */
export async function fetchActivityFeedApi(): Promise<ActivityEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return [
        { time: '08:15', label: 'Safety Briefing completed', status: 'done' },
        { time: '09:30', label: 'Rebar inspection — Zone 3', status: 'done' },
        { time: '11:00', label: 'RFI submitted: drainage specs', status: 'pending' },
        { time: '14:00', label: 'Concrete pour — Section A', status: 'upcoming' },
        { time: '16:30', label: 'EOD photo log submission', status: 'upcoming' },
    ];
}
