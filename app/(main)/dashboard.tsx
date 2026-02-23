import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    ActivityEvent,
    DashboardStats,
    fetchActivityFeedApi,
    fetchDashboardStatsApi,
    fetchWeatherApi,
    WeatherData
} from '../../services/dashboardService';

export default function DashboardScreen() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [feed, setFeed] = useState<ActivityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [s, w, f] = await Promise.all([
                fetchDashboardStatsApi(),
                fetchWeatherApi(),
                fetchActivityFeedApi()
            ]);
            setStats(s);
            setWeather(w);
            setFeed(f);
        } catch (error) {
            console.error('[Dashboard] Error loading data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'short',
    });

    if (isLoading && !isRefreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#09090B" />
                <Text style={styles.loadingText}>Syncing Site Data...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => {
                        setIsRefreshing(true);
                        loadData();
                    }} />
                }
            >

                {/* Header Row */}
                <View style={styles.pageHeader}>
                    <View>
                        <Text style={styles.pageTitle}>Site Intelligence</Text>
                        <Text style={styles.pageSubtitle}>North Block · {today}</Text>
                    </View>
                    <View style={styles.pulseDot}>
                        <View style={styles.dot} />
                        <Text style={styles.pulseText}>Live</Text>
                    </View>
                </View>

                {/* Weather Quick Widget */}
                {weather && (
                    <View style={styles.weatherWidget}>
                        <View style={styles.weatherInfo}>
                            <Ionicons name={weather.icon as any} size={28} color="#EAB308" />
                            <View style={styles.weatherMain}>
                                <Text style={styles.tempText}>{weather.temp}°C</Text>
                                <Text style={styles.conditionText}>{weather.condition}</Text>
                            </View>
                        </View>
                        <View style={styles.weatherDivider} />
                        <Text style={styles.weatherAdvice} numberOfLines={2}>
                            {weather.advice}
                        </Text>
                    </View>
                )}

                {/* Bento Grid */}
                <View style={styles.bentoContainer}>
                    {/* Hero Card: Reliability */}
                    <View style={styles.heroCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>Project Reliability</Text>
                            <Ionicons name="trending-up" size={14} color="#16A34A" />
                        </View>
                        <View style={styles.heroContent}>
                            <Text style={styles.heroValue}>{stats?.reliability ?? 0}%</Text>
                            <Text style={styles.heroTrend}>{stats?.reliabilityTrend}</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${stats?.reliability ?? 0}%` } as any]} />
                        </View>
                    </View>

                    {/* Mid Row: 2 Equi-cards */}
                    <View style={styles.bentoRow}>
                        <View style={styles.bentoSmallCard}>
                            <Text style={styles.cardLabel}>Tasks Done</Text>
                            <Text style={styles.bentoValue}>{stats?.tasksDone ?? 0}</Text>
                            <Text style={styles.bentoSubValue}>of {stats?.tasksTotal ?? 0} total</Text>
                        </View>
                        <View style={styles.bentoSmallCard}>
                            <Text style={styles.cardLabel}>Pending</Text>
                            <Text style={styles.bentoValue}>
                                {(stats?.pendingCount ?? 0) < 10 ? `0${stats?.pendingCount ?? 0}` : stats?.pendingCount}
                            </Text>
                            <Text style={styles.bentoSubValue}>{stats?.highPriorityPending ?? 0} high priority</Text>
                        </View>
                    </View>

                    {/* Bottom Row: Triple Split or Single Wide */}
                    <View style={styles.wideCard}>
                        <View style={styles.wideRow}>
                            <View style={styles.wideItem}>
                                <Text style={styles.cardLabel}>Open RFIs</Text>
                                <Text style={styles.wideValue}>
                                    {(stats?.openRfis ?? 0) < 10 ? `0${stats?.openRfis ?? 0}` : stats?.openRfis}
                                </Text>
                            </View>
                            <View style={styles.dividerInner} />
                            <View style={styles.wideItem}>
                                <Text style={styles.cardLabel}>Safety Pulse</Text>
                                <Text style={[styles.wideValue, { color: stats?.safetyPulse === 'Good' ? '#16A34A' : '#EF4444' }]}>
                                    {stats?.safetyPulse ?? '...'}
                                </Text>
                            </View>
                            <View style={styles.dividerInner} />
                            <View style={styles.wideItem}>
                                <Text style={styles.cardLabel}>Active Staff</Text>
                                <Text style={styles.wideValue}>{stats?.activeStaff ?? 0}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Timeline Section */}
                <Text style={styles.sectionTitle}>Activity Feed</Text>
                <View style={styles.feedCard}>
                    {feed.map((item, i) => (
                        <View key={i} style={[styles.feedRow, i < feed.length - 1 && styles.feedRowBorder]}>
                            <Text style={styles.feedTime}>{item.time}</Text>
                            <View style={styles.feedContent}>
                                <Text style={[styles.feedLabel, item.status === 'done' && styles.feedLabelDone]}>
                                    {item.label}
                                </Text>
                                <View style={[
                                    styles.statusIndicator,
                                    { backgroundColor: item.status === 'done' ? '#E4E4E7' : item.status === 'pending' ? '#F59E0B' : '#16A34A' }
                                ]} />
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles: any = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 14, color: '#71717A', fontWeight: '500' },
    scroll: { paddingHorizontal: 16, paddingTop: 16 },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    pageTitle: { fontSize: 22, fontWeight: '700', color: '#09090B', letterSpacing: -0.5 },
    pageSubtitle: { fontSize: 13, color: '#71717A', marginTop: 2 },
    pulseDot: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: '#F4F4F5',
        gap: 6,
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A34A' },
    pulseText: { fontSize: 11, fontWeight: '600', color: '#09090B', textTransform: 'uppercase' },

    weatherWidget: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    weatherMain: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    tempText: { fontSize: 24, fontWeight: '800', color: '#09090B' },
    conditionText: { fontSize: 14, fontWeight: '600', color: '#71717A' },
    weatherDivider: {
        height: 1,
        backgroundColor: '#F4F4F5',
        marginVertical: 12,
    },
    weatherAdvice: {
        fontSize: 13,
        color: '#3F3F46',
        lineHeight: 18,
        fontStyle: 'italic',
    },

    bentoContainer: {
        gap: 12,
        marginBottom: 32,
    },
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabel: { fontSize: 12, fontWeight: '500', color: '#71717A', textTransform: 'uppercase', letterSpacing: 0.5 },
    heroContent: {
        marginBottom: 16,
    },
    heroValue: { fontSize: 36, fontWeight: '800', color: '#09090B', letterSpacing: -1 },
    heroTrend: { fontSize: 12, color: '#16A34A', fontWeight: '500', marginTop: 4 },
    progressBar: {
        height: 6,
        backgroundColor: '#F4F4F5',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#16A34A',
        borderRadius: 3,
    },

    bentoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    bentoSmallCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    bentoValue: { fontSize: 28, fontWeight: '700', color: '#09090B', marginTop: 8 },
    bentoSubValue: { fontSize: 11, color: '#A1A1AA', marginTop: 2 },

    wideCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    wideRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    wideItem: {
        flex: 1,
        alignItems: 'center',
    },
    wideValue: { fontSize: 18, fontWeight: '700', color: '#09090B', marginTop: 4 },
    dividerInner: {
        width: 1,
        height: 24,
        backgroundColor: '#E4E4E7',
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#09090B',
        marginBottom: 12,
        paddingHorizontal: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    feedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        overflow: 'hidden',
    },
    feedRow: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        gap: 16,
    },
    feedRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F4F4F5',
    },
    feedTime: {
        fontSize: 12,
        fontWeight: '600',
        color: '#A1A1AA',
        width: 44,
    },
    feedContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    feedLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#09090B',
    },
    feedLabelDone: {
        color: '#A1A1AA',
        textDecorationLine: 'line-through',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
