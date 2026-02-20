import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const TIMELINE = [
    { time: '08:15', label: 'Safety Briefing completed', status: 'done' },
    { time: '09:30', label: 'Rebar inspection — Zone 3', status: 'done' },
    { time: '11:00', label: 'RFI submitted: drainage specs', status: 'pending' },
    { time: '14:00', label: 'Concrete pour — Section A', status: 'upcoming' },
    { time: '16:30', label: 'EOD photo log submission', status: 'upcoming' },
];

export default function DashboardScreen() {
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'short',
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

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

                {/* Bento Grid */}
                <View style={styles.bentoContainer}>
                    {/* Hero Card: Reliability */}
                    <View style={styles.heroCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>Project Reliability</Text>
                            <Ionicons name="trending-up" size={14} color="#16A34A" />
                        </View>
                        <View style={styles.heroContent}>
                            <Text style={styles.heroValue}>78.4%</Text>
                            <Text style={styles.heroTrend}>+2.1% from last week</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '78.4%' }]} />
                        </View>
                    </View>

                    {/* Mid Row: 2 Equi-cards */}
                    <View style={styles.bentoRow}>
                        <View style={styles.bentoSmallCard}>
                            <Text style={styles.cardLabel}>Tasks Done</Text>
                            <Text style={styles.bentoValue}>14</Text>
                            <Text style={styles.bentoSubValue}>of 20 total</Text>
                        </View>
                        <View style={styles.bentoSmallCard}>
                            <Text style={styles.cardLabel}>Pending</Text>
                            <Text style={styles.bentoValue}>05</Text>
                            <Text style={styles.bentoSubValue}>3 high priority</Text>
                        </View>
                    </View>

                    {/* Bottom Row: Triple Split or Single Wide */}
                    <View style={styles.wideCard}>
                        <View style={styles.wideRow}>
                            <View style={styles.wideItem}>
                                <Text style={styles.cardLabel}>Open RFIs</Text>
                                <Text style={styles.wideValue}>03</Text>
                            </View>
                            <View style={styles.dividerInner} />
                            <View style={styles.wideItem}>
                                <Text style={styles.cardLabel}>Safety Pulse</Text>
                                <Text style={[styles.wideValue, { color: '#16A34A' }]}>Good</Text>
                            </View>
                            <View style={styles.dividerInner} />
                            <View style={styles.wideItem}>
                                <Text style={styles.cardLabel}>Active Staff</Text>
                                <Text style={styles.wideValue}>42</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Timeline Section */}
                <Text style={styles.sectionTitle}>Activity Feed</Text>
                <View style={styles.feedCard}>
                    {TIMELINE.map((item, i) => (
                        <View key={item.time} style={[styles.feedRow, i < TIMELINE.length - 1 && styles.feedRowBorder]}>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    scroll: { paddingHorizontal: 16, paddingTop: 16 },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
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
