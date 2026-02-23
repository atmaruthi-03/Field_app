import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StatusBar as RNStatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 0;

const NAV_ITEMS = [
    { label: 'Home · Alfred', icon: 'sparkles-outline' as const, route: '/(main)/' },
    { label: 'History & Logs', icon: 'list-outline' as const, route: '/(main)/history' },
    { label: 'Dashboard', icon: 'bar-chart-outline' as const, route: '/(main)/dashboard' },
    { label: 'Notifications', icon: 'notifications-outline' as const, route: null },
];

interface AppShellProps {
    children: React.ReactNode;
}

/** Formats a snake_case role string into Title Case */
function formatRole(role: string): string {
    return role
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export default function AppShell({ children }: AppShellProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { startNewChat } = useChat();

    const isActive = (route: string | null) => {
        if (!route) return false;
        // Match root exactly, others by prefix
        if (route === '/(main)/') return pathname === '/' || pathname === '/index' || pathname === '';
        return pathname.includes(route.replace('/(main)', ''));
    };

    const handleLogout = () => {
        closeDrawer();
        setTimeout(async () => {
            await signOut();
            router.replace('/(auth)/login');
        }, 200);
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
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.iconBtn} onPress={openDrawer} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                            <Ionicons name="menu-outline" size={28} color="#1A1A1A" />
                        </TouchableOpacity>

                        <View style={styles.branding}>
                            <Text style={styles.brandText}>Alfred</Text>
                        </View>
                    </View>

                    {/* Right side for chat actions */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => {
                                startNewChat();
                                if (pathname !== '/') router.replace('/(main)');
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={26} color="#1A1A1A" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => navigate('/(main)/sessions')}
                        >
                            <Ionicons name="time-outline" size={26} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>
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
            <Animated.View
                pointerEvents={drawerOpen ? 'auto' : 'none'}
                style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}
            >
                {/* Drawer Header */}
                <View style={[styles.drawerHeader, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.drawerUserName}>{user?.name ?? 'User'}</Text>
                        <Text style={styles.drawerUserRole}>
                            {user?.role ? formatRole(user.role) : 'Field App'}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Nav Items */}
                <View style={styles.navItems}>
                    <Text style={styles.navSectionLabel}>Navigation</Text>
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.route);
                        return (
                            <TouchableOpacity
                                key={item.label}
                                style={[styles.navItem, active && styles.navItemActive]}
                                activeOpacity={0.7}
                                onPress={() => navigate(item.route)}
                            >
                                <Ionicons
                                    name={item.icon}
                                    size={20}
                                    color={active ? '#09090B' : '#71717A'}
                                />
                                <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
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
        backgroundColor: '#FAFAFA',
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E7',
        zIndex: 10,
    },
    headerInner: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    branding: {
        backgroundColor: '#F4F4F5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    brandText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#52525B',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
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
        backgroundColor: '#FFFFFF',
        zIndex: 30,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 20,
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        gap: 14,
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E7',
    },
    avatarCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#09090B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    drawerUserName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#09090B',
    },
    drawerUserRole: {
        fontSize: 12,
        color: '#71717A',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E4E4E7',
    },
    navItems: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    navSectionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 6,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 13,
        gap: 14,
        borderRadius: 10,
        marginBottom: 2,
    },
    navItemActive: {
        backgroundColor: '#F4F4F5',
    },
    navLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#09090B',
    },
    navLabelActive: {
        color: '#09090B',
        fontWeight: '600',
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
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: '#FEF2F2',
        borderRadius: 10,
        marginBottom: 10,
    },
    logoutText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
    },
    versionText: {
        fontSize: 11,
        color: '#A1A1AA',
        textAlign: 'center',
    },
});
