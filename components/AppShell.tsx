import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    Keyboard,
    Modal,
    Platform,
    StatusBar as RNStatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 0;

const NAV_ITEMS = [
    { label: 'Home · Alfred', icon: 'hardware-chip-outline' as const, route: '/(main)/' },
    { label: 'History', icon: 'list-outline' as const, route: '/(main)/history' },
    { label: 'Dashboard', icon: 'bar-chart-outline' as const, route: '/(main)/dashboard' },
    { label: 'Alerts', icon: 'notifications-outline' as const, route: '/(main)/notifications' },
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
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { startNewChat } = useChat();

    React.useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const isActive = (route: string | null) => {
        if (!route) return false;
        // Match root exactly, others by prefix
        if (route === '/(main)/') return pathname === '/' || pathname === '/index' || pathname === '';
        return pathname.includes(route.replace('/(main)', ''));
    };

    const navigate = (route: string | null) => {
        if (route) {
            router.push(route as never);
        }
    };

    const handleLogout = async () => {
        setProfileVisible(false);
        await signOut();
        router.replace('/(auth)/login');
    };

    const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? 'U';

    return (
        <View style={styles.root}>
            {/* Status bar fix for Android */}
            <StatusBar style="dark" backgroundColor="#fff" />

            {/* Profile Popover Modal */}
            <Modal
                visible={profileVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setProfileVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setProfileVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.popoverContainer}>
                                <View style={styles.popoverHeader}>
                                    <View style={styles.popoverAvatar}>
                                        <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
                                    </View>
                                    <View>
                                        <Text style={styles.popoverName}>{user?.name ?? 'User'}</Text>
                                        <Text style={styles.popoverRole}>{user?.role ? formatRole(user.role) : 'Field Engineer'}</Text>
                                    </View>
                                </View>

                                <View style={styles.popoverDivider} />

                                <TouchableOpacity style={[styles.popoverItem, styles.logoutItem]} onPress={handleLogout}>
                                    <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                                    <Text style={[styles.popoverItemText, styles.logoutText]}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Global Top Bar */}
            <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT }]}>
                <View style={styles.headerInner}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            style={styles.avatarBtn}
                            onPress={() => setProfileVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="person-circle-outline" size={28} color="#1A1A1A" />
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
            <View style={[
                styles.content,
                !keyboardVisible && { paddingBottom: Platform.OS === 'ios' ? 85 : 75 }
            ]}>
                {children}
            </View>

            {/* Premium Bottom Tab Bar */}
            {!keyboardVisible && (
                <View style={styles.bottomTabContainer}>
                    <View style={styles.bottomTabBar}>
                        {NAV_ITEMS.map((item) => {
                            const active = isActive(item.route);
                            // Convert outline icon to filled icon for active state if available
                            const iconName = active
                                ? item.icon.replace('-outline', '') as any
                                : item.icon;

                            // Shorten labels for bottom tab
                            const tabLabel = item.label.includes('Home') ? 'Alfred' : item.label;

                            return (
                                <TouchableOpacity
                                    key={item.label}
                                    style={styles.tabItem}
                                    onPress={() => navigate(item.route)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={iconName}
                                        size={22}
                                        color={active ? '#34A853' : '#A1A1AA'}
                                    />
                                    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                                        {tabLabel}
                                    </Text>
                                    {active && <View style={styles.tabIndicator} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles: any = StyleSheet.create({
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
        gap: 12,
    },
    avatarBtn: {
        padding: 2,
    },
    headerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#09090B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerAvatarText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    branding: {
        backgroundColor: '#34A853',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },
    brandText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
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
    bottomTabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E4E4E7',
        paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        paddingTop: 10,
        zIndex: 10,
    },
    bottomTabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
        paddingHorizontal: 12,
        flex: 1,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#A1A1AA',
        marginTop: 4,
    },
    tabLabelActive: {
        color: '#34A853',
        fontWeight: '700',
    },
    tabIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#34A853',
        position: 'absolute',
        top: -6,
    },
    // Popover Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'flex-start',
        paddingTop: STATUS_BAR_HEIGHT + 60, // Position below header
        paddingLeft: 16,
    },
    popoverContainer: {
        width: 240,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    popoverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    popoverAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#09090B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverAvatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    popoverName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#09090B',
    },
    popoverRole: {
        fontSize: 12,
        color: '#71717A',
    },
    popoverDivider: {
        height: 1,
        backgroundColor: '#F4F4F5',
        marginVertical: 4,
    },
    popoverItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
    },
    popoverItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3F3F46',
    },
    logoutItem: {
        marginTop: 4,
    },
    logoutText: {
        color: '#EF4444',
    },
});
