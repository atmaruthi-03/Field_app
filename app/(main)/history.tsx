import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Flagged', 'Rejected'];

export default function HistoryScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* Search and Filters */}
            <View style={styles.searchSection}>
                <View style={styles.searchRow}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={18} color="#8E8E93" />
                        <TextInput
                            placeholder="Search task or engineer..."
                            style={styles.searchInput}
                            placeholderTextColor="#999"
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="options-outline" size={22} color="#1A1A1A" />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {STATUS_FILTERS.map((filter, index) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterChip, index === 0 && styles.filterChipActive]}
                        >
                            <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.dateRangeRow}>
                    <View style={styles.dateInfo}>
                        <Ionicons name="calendar-outline" size={16} color="#444" />
                        <Text style={styles.dateText}>Oct 12, 2023 - Oct 19, 2023</Text>
                    </View>
                    <TouchableOpacity><Text style={styles.editRangeText}>Edit Range</Text></TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.timelineContainer} showsVerticalScrollIndicator={false}>
                {/* Timeline Item 1 */}
                <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                        <View style={[styles.statusDot, { backgroundColor: '#FF9500' }]} />
                        <View style={styles.verticalLine} />
                    </View>

                    <View style={styles.logCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.badgeContainer}>
                                <View style={[styles.statusBadge, { backgroundColor: '#FFF7E6' }]}>
                                    <Text style={[styles.statusBadgeText, { color: '#FF9500' }]}>SUBMITTED FOR REVIEW</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.askAlfredButton}>
                                <Ionicons name="sparkles" size={14} color="#34A853" />
                                <Text style={styles.askAlfredText}>Ask Alfred</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.cardTitle}>Rebar installation - Section B</Text>
                        <Text style={styles.cardSubtitle}>Field Engineer: Sarah Jenkins • 2h ago</Text>

                        <View style={styles.cardImageWrapper}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1541913007141-8622c8180ec5?auto=format&fit=crop&q=80&w=600' }}
                                style={styles.cardImage}
                            />
                            <View style={styles.imageOverlayBadge}>
                                <Ionicons name="camera" size={12} color="#fff" />
                                <Text style={styles.imageOverlayText}>IMG_4028.JPG</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Timeline Item 2 */}
                <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                        <View style={[styles.statusDot, { backgroundColor: '#34A853' }]} />
                        {/* No vertical line if it's the last item, or continue it */}
                        <View style={styles.verticalLine} />
                    </View>

                    <View style={styles.logCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.badgeContainer}>
                                <View style={[styles.statusBadge, { backgroundColor: '#E6F7ED' }]}>
                                    <Text style={[styles.statusBadgeText, { color: '#34A853' }]}>APPROVAL GRANTED</Text>
                                </View>
                            </View>
                            <Ionicons name="sparkles" size={18} color="#D1D1D6" />
                        </View>

                        <Text style={styles.cardTitle}>Foundation Ready</Text>
                        <Text style={styles.cardSubtitle}>Project Manager: Mike Ross • 4h ago</Text>

                        <View style={styles.approvalNote}>
                            <View style={styles.quoteLine} />
                            <Text style={styles.quoteText}>
                                "Reinforcement meets specs for Section A. Proceed to concrete pour as scheduled 08:00 tomorrow."
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    searchSection: {
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E7',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F4F5',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 36,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#09090B',
    },
    filterButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F4F4F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterScroll: {
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: '#F4F4F5',
        marginRight: 6,
    },
    filterChipActive: {
        backgroundColor: '#09090B',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#71717A',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    dateRangeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        color: '#444',
        fontWeight: '500',
    },
    editRangeText: {
        fontSize: 12,
        color: '#1890FF',
        fontWeight: '600',
    },
    timelineContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    timelineLeft: {
        width: 30,
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 6,
        zIndex: 1,
    },
    verticalLine: {
        position: 'absolute',
        top: 18,
        bottom: -4,
        width: 2,
        backgroundColor: '#E5E5EA',
    },
    logCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
        marginLeft: 4,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    askAlfredButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F4F4F5',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
    },
    askAlfredText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#16A34A',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 3,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 12,
    },
    cardImageWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    imageOverlayBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    imageOverlayText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    approvalNote: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#34A853',
    },
    quoteLine: {
        width: 3,
        backgroundColor: '#34A853',
        marginRight: 12,
    },
    quoteText: {
        fontSize: 13,
        color: '#444',
        fontStyle: 'italic',
        lineHeight: 18,
    },
});
