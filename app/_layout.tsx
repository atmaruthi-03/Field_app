import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';

function RootLayoutNav() {
    const { user, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inMainGroup = segments[0] === '(main)';

        if (!user && !inAuthGroup) {
            // Redirect to login if user is not authenticated and trying to access main app or root
            router.replace('/(auth)/login');
        } else if (user && !inMainGroup) {
            // Redirect to main if user is authenticated and trying to access auth screens or root
            router.replace('/(main)');
        }
    }, [user, isLoading, segments]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
                <ActivityIndicator size="large" color="#34A853" />
            </View>
        );
    }

    return (
        <ChatProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </ChatProvider>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
