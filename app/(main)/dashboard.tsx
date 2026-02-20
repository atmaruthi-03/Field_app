import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const KPI_CARDS = [
    {
        label: 'Tasks Completed',
        value: '14',
        total: '/ 20',
        icon: 'checkmark-circle' as const,
        color: '#34A853',
        bg: '#E6F7ED',
        trend: '+3 this week',
        trendUp: true,
    },
    {
        label: 'Pending Approvals',
        value: '5',
        total: '',
        icon: 'time' as const,
        color: '#FF9500',
        bg: '#FFF7E6',
        trend: '2 urgent',
        trendUp: false,
    },
    {
        label: 'Open RFIs',
        value: '3',
        total: '',
        icon: 'document-text' as const,
        color: '#1890FF',
        bg: '#E6F4FF',
        trend: '1 overdue',
        trendUp: false,
    },
    {
        label: 'Site Progress',
        value: '68%',
        total: '',
        icon: 'trending-up' as const,
        color: '#7C3AED',
        bg: '#F3E8FF',
        trend: '+5% vs last week',
        trendUp: true,
    },
];

const TIMELINE = [
    { time: '08:15', label: 'Safety Briefing completed', status: 'done', color: '#34A853' },
    { time: '09:30', label: 'Rebar inspection — Zone 3', status: 'done', color: '#34A853' },
    { time: '11:00', label: 'RFI submitted: drainage specs', status: 'pending', color: '#FF9500' },
    { time: '14:00', label: 'Concrete pour — Section A', status: 'upcoming', color: '#1890FF' },
    { time: '16:30', label: 'EOD photo log submission', status: 'upcoming', color: '#1890FF' },
];

export default function DashboardScreen() {
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Header Row */}
                <View style={styles.pageHeader}>
                    <View>
                        <Text style={styles.pageTitle}>Dashboard</Text>
                        <Text style={styles.pageSubtitle}>{today}</Text>
                    </View>
                    <View style={styles.siteBadge}>
                        <Ionicons name="location" size={13} color="#34A853" />
                        <Text style={styles.siteBadgeText}>North Block</Text>
                    </View>
                </View>

                {/* KPI Grid */}
                <View style={styles.kpiGrid}>
                    {KPI_CARDS.map((kpi) => (
                        <TouchableOpacity key={kpi.label} style={styles.kpiCard} activeOpacity={0.8}>
                            <View style={[styles.kpiIconWrap, { backgroundColor: kpi.bg }]}>
                                <Ionicons name={kpi.icon} size={22} color={kpi.color} />
                            </View>
                            <Text style={styles.kpiValue}>
                                {kpi.value}
                                <Text style={styles.kpiTotal}>{kpi.total}</Text>
                            </Text>
                            <Text style={styles.kpiLabel}>{kpi.label}</Text>
                            <View style={styles.kpiTrendRow}>
                                <Ionicons
                                    name={kpi.trendUp ? 'arrow-up' : 'alert-circle-outline'}
                                    size={12}
                                    color={kpi.trendUp ? '#34A853' : '#FF9500'}
                                />
                                <Text style={[styles.kpiTrend, { color: kpi.trendUp ? '#34A853' : '#FF9500' }]}>
                                    {kpi.trend}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Today's Timeline */}
                <Text style={styles.sectionTitle}>Today's Timeline</Text>
                <View style={styles.timelineCard}>
                    {TIMELINE.map((item, i) => (
                        <View key={item.time} style={[styles.timelineRow, i < TIMELINE.length - 1 && styles.timelineRowBorder]}>
                            <Text style={styles.timelineTime}>{item.time}</Text>
                            <View style={[styles.timelineDot, { backgroundColor: item.color }]} />
                            <Text style={[
                                styles.timelineLabel,
                                item.status === 'done' && styles.timelineDone,
                            ]}>
                                {item.label}
                            </Text>
                            {item.status === 'upcoming' && (
                                <View style={styles.upcomingBadge}>
                                    <Text style={styles.upcomingText}>Soon</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    scroll: { paddingHorizontal: 20, paddingTop: 20 },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    pageTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
    pageSubtitle: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
    siteBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6F7ED',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    siteBadgeText: { fontSize: 12, fontWeight: '700', color: '#34A853' },
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 28,
    },
    kpiCard: {
        width: '47.5%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    kpiIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    kpiValue: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', letterSpacing: -1 },
    kpiTotal: { fontSize: 16, fontWeight: '400', color: '#8E8E93' },
    kpiLabel: { fontSize: 13, color: '#8E8E93', marginTop: 4, marginBottom: 8 },
    kpiTrendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    kpiTrend: { fontSize: 12, fontWeight: '600' },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 14,
        letterSpacing: -0.3,
    },
    timelineCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
    },
    timelineRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    timelineTime: { fontSize: 12, fontWeight: '700', color: '#8E8E93', width: 42 },
    timelineDot: { width: 8, height: 8, borderRadius: 4 },
    timelineLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
    timelineDone: { color: '#8E8E93', textDecorationLine: 'line-through' },
    upcomingBadge: {
        backgroundColor: '#E6F4FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    upcomingText: { fontSize: 11, fontWeight: '700', color: '#1890FF' },
});
