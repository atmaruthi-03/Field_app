import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthUser, fetchMeApi, loginApi } from '../services/authService';

import Config from '../constants/Config';

const TOKEN_KEY = Config.STORAGE_KEYS.TOKEN;

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    /** True only during the initial token-check on app startup */
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On app startup: try to restore a saved session
    useEffect(() => {
        async function restoreSession() {
            try {
                const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                if (savedToken) {
                    const me = await fetchMeApi(savedToken);
                    setToken(savedToken);
                    setUser(me);
                }
            } catch {
                // Token invalid or expired — silently clear it
                await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => { });
            } finally {
                setIsLoading(false);
            }
        }
        restoreSession();
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        const { access_token } = await loginApi(email, password);
        const me = await fetchMeApi(access_token);
        await SecureStore.setItemAsync(TOKEN_KEY, access_token);
        setToken(access_token);
        setUser(me);
    }, []);

    const signOut = useCallback(async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => { });
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return ctx;
}
