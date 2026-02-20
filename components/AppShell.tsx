import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    StatusBar as RNStatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 0;

const NAV_ITEMS = [
    { label: 'Home · Alfred', icon: 'sparkles' as const, route: '/(main)/' },
    { label: 'History & Logs', icon: 'time-outline' as const, route: '/(main)/history' },
    { label: 'Dashboard', icon: 'bar-chart-outline' as const, route: '/(main)/dashboard' },
    { label: 'Notifications', icon: 'notifications-outline' as const, route: null },
];

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    const handleLogout = () => {
        closeDrawer();
        setTimeout(() => router.replace('/'), 200);
    };

    const openDrawer = () => {
        setDrawerOpen(true);
        Animated.parallel([
            Animated.spring(drawerAnim, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 0,
                speed: 20,
            }),
            Animated.timing(overlayAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeDrawer = () => {
        Animated.parallel([
            Animated.spring(drawerAnim, {
                toValue: -DRAWER_WIDTH,
                useNativeDriver: true,
                bounciness: 0,
                speed: 20,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => setDrawerOpen(false));
    };

    const navigate = (route: string | null) => {
        closeDrawer();
        if (route) {
            setTimeout(() => router.push(route as never), 150);
        }
    };

    return (
        <View style={styles.root}>
            {/* Status bar fix for Android */}
            <StatusBar style="dark" backgroundColor="#fff" />

            {/* Global Top Bar */}
            <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT }]}>
                <View style={styles.headerInner}>
                    {/* Left: Hamburger */}
                    <TouchableOpacity style={styles.iconBtn} onPress={openDrawer} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Ionicons name="menu-outline" size={28} color="#1A1A1A" />
                    </TouchableOpacity>

                    <Image
                        source={require('../assets/images/Alfred.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Spacer right to balance logo center */}
                    <View style={{ width: 44 }} />
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {children}
            </View>

            {/* Drawer Overlay */}
            {drawerOpen && (
                <TouchableWithoutFeedback onPress={closeDrawer}>
                    <Animated.View
                        style={[styles.overlay, { opacity: overlayAnim }]}
                    />
                </TouchableWithoutFeedback>
            )}

            {/* Animated Drawer Panel */}
            <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
                {/* Drawer Header */}
                <View style={[styles.drawerHeader, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>M</Text>
                    </View>
                    <View>
                        <Text style={styles.drawerUserName}>Maruthi</Text>
                        <Text style={styles.drawerUserRole}>Field Engineer</Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Nav Items */}
                <View style={styles.navItems}>
                    {NAV_ITEMS.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.navItem}
                            activeOpacity={0.7}
                            onPress={() => navigate(item.route)}
                        >
                            <View style={styles.navIconWrapper}>
                                <Ionicons name={item.icon} size={22} color="#34A853" />
                            </View>
                            <Text style={styles.navLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom: Logout Button */}
                <View style={styles.drawerFooter}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>Alfred Field App · v0.1.0</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        zIndex: 10,
    },
    headerInner: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    logo: {
        width: 110,
        height: 30,
    },
    iconBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 20,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        zIndex: 30,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 20,
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 14,
        backgroundColor: '#F8F9FA',
    },
    avatarCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#34A853',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },
    drawerUserName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    drawerUserRole: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 0,
    },
    navItems: {
        paddingVertical: 12,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        gap: 16,
    },
    navIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#E6F7ED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    drawerFooter: {
        position: 'absolute',
        bottom: 32,
        left: 24,
        right: 24,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFF0EE',
        borderRadius: 12,
        marginBottom: 12,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FF3B30',
    },
    versionText: {
        fontSize: 12,
        color: '#C7C7CC',
        textAlign: 'center',
    },
});
