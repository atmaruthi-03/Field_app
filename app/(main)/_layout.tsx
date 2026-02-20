import { Tabs } from 'expo-router';
import React from 'react';
import AppShell from '../../components/AppShell';

export default function MainLayout() {
    return (
        <AppShell>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { display: 'none' }, // Hidden — nav is via AppShell drawer
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{ title: 'Alfred' }}
                />
                <Tabs.Screen
                    name="history"
                    options={{ title: 'History' }}
                />
                <Tabs.Screen
                    name="dashboard"
                    options={{ title: 'Dashboard' }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{ title: 'Profile' }}
                />
                {/* Hidden/unused routes */}
                <Tabs.Screen name="chat_list" options={{ href: null }} />
                <Tabs.Screen name="search" options={{ href: null }} />
            </Tabs>
        </AppShell>
    );
}
