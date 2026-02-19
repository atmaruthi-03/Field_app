import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeDashboard() {
    const [image, setImage] = React.useState<string | null>(null);

    const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const handleCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Alfred needs camera access to capture site updates.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            Alert.alert('Photo Captured', 'AI is drafting your update for Zone 3...');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
                {/* Section A: The Identity Header */}
                <View style={styles.headerBackground}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greetingText}>Hello, <Text style={styles.userName}>Maruthi</Text></Text>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateText}>{currentDate}</Text>
                                <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.8)" style={styles.chevron} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={24} color="#fff" />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                    </View>

                    {/* Section B: The "Ask Alfred" Pulse */}
                    <View style={styles.searchContainer}>
                        <View style={styles.searchWrapper}>
                            <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Ask Alfred about the site..."
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>
                </View>

                {/* Content Placeholder for Phase 2 & 3 */}
                <View style={styles.content}>
                    {/* Section E: Current Blockers (The Shield) */}
                    <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                        <Text style={styles.sectionTitle}>Current Blockers</Text>
                        <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
                    </View>
                    <View style={styles.blockerCard}>
                        <View style={styles.blockerItem}>
                            <View style={[styles.blockerTag, { backgroundColor: '#FFF2F0' }]}>
                                <Ionicons name="warning" size={14} color="#FF4D4F" />
                                <Text style={styles.blockerTagText}>Material Delay</Text>
                            </View>
                            <Text style={styles.blockerText}>Missing Zone 3 Rebar delivery</Text>
                            <Text style={styles.blockerTime}>Flagged 2h ago</Text>
                        </View>
                        <View style={styles.blockerItem}>
                            <View style={[styles.blockerTag, { backgroundColor: '#F6FFED' }]}>
                                <Ionicons name="checkmark-circle" size={14} color="#52C41A" />
                                <Text style={[styles.blockerTagText, { color: '#52C41A' }]}>Permit Cleared</Text>
                            </View>
                            <Text style={styles.blockerText}>Zone 5 Plumbing Permit approved</Text>
                            <Text style={styles.blockerTime}>Updated 4h ago</Text>
                        </View>
                    </View>

                    {/* Section F: Active Zones (The Feed) */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Active Zones</Text>
                        <TouchableOpacity><Text style={styles.seeAllText}>View Map</Text></TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.zoneCard} activeOpacity={0.7}>
                        <View style={styles.zoneImagePlaceholder}>
                            <Ionicons name="business" size={24} color="#34A853" />
                        </View>
                        <View style={styles.zoneInfo}>
                            <Text style={styles.zoneName}>Zone 3 - North Block</Text>
                            <Text style={styles.zoneStatus}>Reinforcement in progress</Text>
                        </View>
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>3</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.zoneCard} activeOpacity={0.7}>
                        <View style={[styles.zoneImagePlaceholder, { backgroundColor: '#E6F7FF' }]}>
                            <Ionicons name="construct" size={24} color="#1890FF" />
                        </View>
                        <View style={styles.zoneInfo}>
                            <Text style={styles.zoneName}>Zone 5 - Plumbing</Text>
                            <Text style={styles.zoneStatus}>Waiting for RFI response</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Floating Camera Button (Primary CTA) */}
            <TouchableOpacity
                style={styles.fabButton}
                activeOpacity={0.8}
                onPress={handleCamera}
            >
                <Ionicons name="camera" size={28} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    headerBackground: {
        backgroundColor: '#34A853',
        paddingBottom: 30,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? 40 : 20, // Increased for safe area
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greetingText: {
        fontSize: 22,
        color: '#fff',
        opacity: 0.9,
    },
    userName: {
        fontWeight: '700',
        opacity: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    dateText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    chevron: {
        marginLeft: 4,
    },
    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 12,
        right: 14,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF4D4F',
        borderWidth: 2,
        borderColor: '#34A853',
    },
    searchContainer: {
        width: '100%',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    micButton: {
        padding: 8,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    seeAllText: {
        fontSize: 14,
        color: '#34A853',
        fontWeight: '600',
    },
    blockerCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    blockerItem: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    blockerTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    blockerTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FF4D4F',
        marginLeft: 4,
    },
    blockerText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    blockerTime: {
        fontSize: 12,
        color: '#999',
    },
    zoneCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    zoneImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F6FFED',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    zoneInfo: {
        flex: 1,
    },
    zoneName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    zoneStatus: {
        fontSize: 13,
        color: '#666',
    },
    unreadBadge: {
        backgroundColor: '#34A853',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
    },
    unreadText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    fabButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#34A853',
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#34A853',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
});
