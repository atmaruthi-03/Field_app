import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

import BottomTabBar from './AppShell/BottomTabBar';
import ProfilePopover from './AppShell/ProfilePopover';
import styles from './AppShell/styles';

const NAV_ITEMS = [
    { label: 'Home · Alfred', icon: 'hardware-chip-outline' as const, route: '/(main)/' },
    { label: 'History', icon: 'list-outline' as const, route: '/(main)/history' },
    { label: 'Dashboard', icon: 'bar-chart-outline' as const, route: '/(main)/dashboard' },
    { label: 'Alerts', icon: 'notifications-outline' as const, route: '/(main)/notifications' },
];

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { startNewChat } = useChat();

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
        const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleNavigate = (route: string) => {
        router.push(route as any);
    };

    const handleLogout = async () => {
        setProfileVisible(false);
        await signOut();
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.root}>
            <StatusBar style="dark" backgroundColor="#fff" />

            <ProfilePopover
                visible={profileVisible}
                onClose={() => setProfileVisible(false)}
                user={user}
                onLogout={handleLogout}
            />

            {/* Global Top Bar */}
            <View style={styles.header}>
                <View style={[styles.headerInner, { marginTop: Platform.OS === 'android' ? 24 : 0 }]}>
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
                            onPress={() => handleNavigate('/(main)/sessions')}
                        >
                            <Ionicons name="time-outline" size={26} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={[
                styles.content,
                !keyboardVisible && { paddingBottom: Platform.OS === 'ios' ? 85 : 75 }
            ]}>
                {children}
            </View>

            {!keyboardVisible && (
                <BottomTabBar
                    items={NAV_ITEMS}
                    pathname={pathname}
                    onNavigate={handleNavigate}
                />
            )}
        </View>
    );
}
