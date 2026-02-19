import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={40} color="#34A853" />
                        </View>
                        <View>
                            <Text style={styles.userName}>Maruthi T</Text>
                            <Text style={styles.userRole}>Site Supervisor</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Section D: Site KPI Card (Execution & Context) */}
                    <View style={styles.kpiCard}>
                        <View style={styles.kpiHeader}>
                            <View style={styles.locationContainer}>
                                <Ionicons name="location-sharp" size={16} color="#34A853" />
                                <Text style={styles.locationText}>Zone 3 - North Block</Text>
                            </View>
                            <View style={styles.weatherSummary}>
                                <Ionicons name="cloudy-night" size={20} color="#666" />
                                <Text style={styles.weatherTemp}>32°C</Text>
                            </View>
                        </View>

                        <View style={styles.kpiGrid}>
                            <View style={styles.kpiItem}>
                                <View style={[styles.kpiIconBox, { backgroundColor: '#E6F7FF' }]}>
                                    <Ionicons name="list" size={20} color="#1890FF" />
                                </View>
                                <Text style={styles.kpiValue}>12</Text>
                                <Text style={styles.kpiLabel}>Tasks Pending</Text>
                            </View>
                            <View style={styles.kpiItem}>
                                <View style={[styles.kpiIconBox, { backgroundColor: '#F6FFED' }]}>
                                    <Ionicons name="checkmark-done" size={20} color="#52C41A" />
                                </View>
                                <Text style={styles.kpiValue}>08</Text>
                                <Text style={styles.kpiLabel}>Completed</Text>
                            </View>
                            <View style={styles.kpiItem}>
                                <View style={[styles.kpiIconBox, { backgroundColor: '#FFF7E6' }]}>
                                    <Ionicons name="time-outline" size={20} color="#FAAD14" />
                                </View>
                                <Text style={styles.kpiValue}>04</Text>
                                <Text style={styles.kpiLabel}>Delayed</Text>
                            </View>
                        </View>

                        <View style={styles.pulseContainer}>
                            <View style={styles.pulseHeader}>
                                <Text style={styles.pulseTitle}>Overall Progress</Text>
                                <Text style={styles.pulseValue}>78% Reliability</Text>
                            </View>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '78%' }]} />
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="notifications-outline" size={22} color="#666" />
                        <Text style={styles.settingText}>Notifications</Text>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#666" />
                        <Text style={styles.settingText}>Privacy & Security</Text>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => router.replace('/(auth)/login')}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#F5222D" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    content: {
        padding: 24,
    },
    header: {
        backgroundColor: '#34A853',
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    userRole: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    kpiCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        marginTop: -40, // Overlap header
    },
    kpiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 4,
    },
    weatherSummary: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherTemp: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginLeft: 8,
    },
    kpiGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    kpiItem: {
        alignItems: 'center',
        flex: 1,
    },
    kpiIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    kpiValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    kpiLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    pulseContainer: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 16,
    },
    pulseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    pulseTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    pulseValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#34A853',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#34A853',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    settingText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF1F0',
        padding: 16,
        borderRadius: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#FFA39E',
    },
    logoutText: {
        color: '#F5222D',
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
    },
});
