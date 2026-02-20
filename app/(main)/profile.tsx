import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();

    const stats = [
        { label: 'Weekly Hours', value: '42.5' },
        { label: 'Sites Managed', value: '03' },
        { label: 'Reliability', value: '98%' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Header: User Info */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>MT</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Maruthi T</Text>
                        <Text style={styles.userRole}>Site Supervisor · North Block</Text>
                    </View>
                </View>

                {/* Profile Bento Section */}
                <View style={styles.bentoContainer}>
                    {/* Hero Stats */}
                    <View style={styles.statsCard}>
                        {stats.map((stat, i) => (
                            <View key={stat.label} style={styles.statItem}>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Section: Settings */}
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.settingsGroup}>
                        <TouchableOpacity style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="notifications-outline" size={20} color="#71717A" />
                                <Text style={styles.settingLabel}>Notifications</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#A1A1AA" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="shield-checkmark-outline" size={20} color="#71717A" />
                                <Text style={styles.settingLabel}>Security</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#A1A1AA" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="color-palette-outline" size={20} color="#71717A" />
                                <Text style={styles.settingLabel}>Appearance</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#A1A1AA" />
                        </TouchableOpacity>
                    </View>

                    {/* Danger Zone */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => router.replace('/(auth)/login')}
                    >
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>App Version 0.1.0 · Build 124</Text>
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
    scroll: {
        paddingHorizontal: 16,
        paddingTop: 32,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#09090B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#09090B',
        letterSpacing: -0.5,
    },
    userRole: {
        fontSize: 14,
        color: '#71717A',
        marginTop: 2,
    },
    bentoContainer: {
        gap: 24,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#09090B',
    },
    statLabel: {
        fontSize: 11,
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: -12,
        paddingHorizontal: 8,
    },
    settingsGroup: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#09090B',
    },
    divider: {
        height: 1,
        backgroundColor: '#F4F4F5',
        marginLeft: 48,
    },
    logoutButton: {
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#EF4444',
    },
    versionText: {
        fontSize: 12,
        color: '#A1A1AA',
        textAlign: 'center',
        marginTop: 8,
    },
});
