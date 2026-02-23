import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { ChatSession, fetchSessionsApi } from '../../services/chatService';

export default function SessionsScreen() {
    const router = useRouter();
    const { token } = useAuth();
    const { loadSession } = useChat();

    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadSessions = async (quiet = false) => {
        if (!quiet) setIsLoading(true);
        setError(null);
        try {
            const data = await fetchSessionsApi(token || '');
            setSessions(data);
        } catch (err: any) {
            setError(err?.message || 'Failed to load sessions');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleSelectSession = (session: ChatSession) => {
        loadSession(session.session_id);
        router.replace('/(main)');
    };

    const renderItem = ({ item }: { item: ChatSession }) => (
        <TouchableOpacity
            style={styles.sessionCard}
            onPress={() => handleSelectSession(item)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#09090B" />
            </View>
            <View style={styles.sessionInfo}>
                <Text style={styles.sessionQuery} numberOfLines={1}>
                    {item.first_question || 'New Conversation'}
                </Text>
                <Text style={styles.sessionDate}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D1D6" />
        </TouchableOpacity>
    );

    if (isLoading && !isRefreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#09090B" />
                <Text style={styles.loadingText}>Fetching your history...</Text>
            </View>
        );
    }

    if (error && sessions.length === 0) {
        return (
            <View style={styles.center}>
                <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => loadSessions()}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>All Conversations</Text>
                <Text style={styles.subtitle}>{sessions.length} sessions found</Text>
            </View>

            <FlatList
                data={sessions}
                keyExtractor={(item) => item.session_id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => {
                        setIsRefreshing(true);
                        loadSessions(true);
                    }} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={64} color="#E4E4E7" />
                        <Text style={styles.emptyTitle}>No conversations yet</Text>
                        <Text style={styles.emptyDescription}>
                            Your chat history with Alfred will appear here.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        padding: 24,
        paddingTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#09090B',
    },
    subtitle: {
        fontSize: 14,
        color: '#71717A',
        marginTop: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    sessionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F4F4F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionQuery: {
        fontSize: 16,
        fontWeight: '600',
        color: '#09090B',
    },
    sessionDate: {
        fontSize: 12,
        color: '#71717A',
        marginTop: 4,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#71717A',
    },
    errorText: {
        fontSize: 16,
        color: '#09090B',
        textAlign: 'center',
        marginTop: 16,
    },
    retryBtn: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: '#09090B',
        borderRadius: 10,
    },
    retryText: {
        color: '#FFF',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#09090B',
        marginTop: 16,
    },
    emptyDescription: {
        fontSize: 14,
        color: '#71717A',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
});
