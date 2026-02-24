import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useChat } from '../../context/ChatContext';

interface Notification {
    id: string;
    type: 'ai' | 'system' | 'alert';
    title: string;
    description: string;
    time: string;
    dateGroup: 'Today' | 'Yesterday' | 'Earlier';
    read: boolean;
    actionLabel?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'ai',
        title: 'Morning Update from Alfred',
        description: 'You have 3 site visits scheduled today. Safety inspections are pending for Section B.',
        time: '08:00 AM',
        dateGroup: 'Today',
        read: false,
        actionLabel: 'Discuss with Alfred'
    },
    {
        id: '2',
        type: 'alert',
        title: 'Safety Flag Raised',
        description: 'Incident report #204 was flagged for immediate review in Project Alpha.',
        time: '09:15 AM',
        dateGroup: 'Today',
        read: false,
        actionLabel: 'View Details'
    },
    {
        id: '3',
        type: 'system',
        title: 'Daily Summary Ready',
        description: 'Your field activity report for yesterday has been generated and is ready for review.',
        time: '6:45 PM',
        dateGroup: 'Yesterday',
        read: true,
    },
    {
        id: '4',
        type: 'ai',
        title: 'Alfred Suggestion',
        description: "I noticed the concrete pour was delayed. Should I reschedule tomorrow's team briefing?",
        time: '5:30 PM',
        dateGroup: 'Yesterday',
        read: true,
        actionLabel: 'Chat with Alfred'
    },
    {
        id: '5',
        type: 'system',
        title: 'System Maintenance',
        description: 'Alfred will be undergoing brief server maintenance at midnight tonight.',
        time: '2 days ago',
        dateGroup: 'Earlier',
        read: true,
    }
];

export default function NotificationsScreen() {
    const router = useRouter();
    const { startNewChat, sendMessage } = useChat();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    const groupedData = useMemo(() => {
        const sections: { title: string; data: Notification[] }[] = [
            { title: 'Today', data: notifications.filter(n => n.dateGroup === 'Today') },
            { title: 'Yesterday', data: notifications.filter(n => n.dateGroup === 'Yesterday') },
            { title: 'Earlier', data: notifications.filter(n => n.dateGroup === 'Earlier') },
        ];
        return sections.filter(s => s.data.length > 0);
    }, [notifications]);

    const handleAction = async (item: Notification) => {
        if (item.type === 'ai' || item.actionLabel?.toLowerCase().includes('alfred')) {
            startNewChat();
            router.replace('/(main)');

            if (item.id === '1') {
                setTimeout(() => sendMessage("Tell me more about my 3 site visits today."), 500);
            } else if (item.id === '4') {
                setTimeout(() => sendMessage("Tell me about the concrete delay suggestion."), 500);
            }
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={[styles.card, !item.read && styles.unreadCard]}>
            <View style={styles.cardTop}>
                <View style={[styles.typeBadge, styles[`${item.type}Badge`]]}>
                    <Ionicons
                        name={item.type === 'ai' ? 'sparkles' : item.type === 'alert' ? 'warning' : 'notifications'}
                        size={12}
                        color={item.type === 'ai' ? '#34A853' : item.type === 'alert' ? '#EF4444' : '#71717A'}
                    />
                    <Text style={[styles.typeText, styles[`${item.type}TypeText`]]}>
                        {item.type.toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.itemTime}>{item.time}</Text>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
            </View>

            {item.actionLabel && (
                <TouchableOpacity
                    style={[styles.actionBtn, item.type === 'ai' && styles.aiActionBtn]}
                    onPress={() => handleAction(item)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.actionText, item.type === 'ai' && styles.aiActionText]}>
                        {item.actionLabel}
                    </Text>
                    <Ionicons
                        name="arrow-forward"
                        size={14}
                        color={item.type === 'ai' ? '#34A853' : '#1A1A1A'}
                    />
                </TouchableOpacity>
            )}
            {!item.read && <View style={styles.unreadIndicator} />}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Alerts</Text>
                    <Text style={styles.subtitle}>Stay updated with site activity</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    activeOpacity={0.6}
                >
                    <Text style={styles.markRead}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={groupedData}
                keyExtractor={(item) => item.title}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#34A853']} tintColor="#34A853" />
                }
                renderItem={({ item: section }) => (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                        {section.data.map(item => (
                            <View key={item.id}>
                                {renderItem({ item })}
                            </View>
                        ))}
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="shield-checkmark-outline" size={40} color="#34A853" />
                        </View>
                        <Text style={styles.emptyTitle}>All Clear</Text>
                        <Text style={styles.emptyDescription}>No critical alerts or pending updates at the moment.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles: any = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#09090B',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#71717A',
        marginTop: 2,
    },
    markRead: {
        fontSize: 13,
        color: '#34A853',
        fontWeight: '700',
        paddingBottom: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '800',
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E4E4E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        position: 'relative',
    },
    unreadCard: {
        borderColor: '#34A85320',
        backgroundColor: '#FFFFFF',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    aiBadge: { backgroundColor: '#F0FDF4' },
    alertBadge: { backgroundColor: '#FEF2F2' },
    systemBadge: { backgroundColor: '#F4F4F5' },
    typeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    aiTypeText: { color: '#34A853' },
    alertTypeText: { color: '#EF4444' },
    systemTypeText: { color: '#71717A' },
    itemTime: {
        fontSize: 11,
        color: '#A1A1AA',
        fontWeight: '500',
    },
    cardBody: {
        marginBottom: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#09090B',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        color: '#52525B',
        lineHeight: 20,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F4F4F5',
        gap: 6,
    },
    aiActionBtn: {
        borderTopColor: '#34A85310',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    aiActionText: {
        color: '#34A853',
    },
    unreadIndicator: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#34A853',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#09090B',
    },
    emptyDescription: {
        fontSize: 14,
        color: '#71717A',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
        lineHeight: 20,
    },
});
