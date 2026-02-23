import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
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
        read: false,
        actionLabel: 'Discuss with Alfred'
    },
    {
        id: '2',
        type: 'alert',
        title: 'Safety Flag Raised',
        description: 'Incident report #204 was flagged for immediate review in Project Alpha.',
        time: '09:15 AM',
        read: false,
        actionLabel: 'View Details'
    },
    {
        id: '3',
        type: 'system',
        title: 'Daily Summary Ready',
        description: 'Your field activity report for yesterday has been generated and is ready for review.',
        time: 'Yesterday',
        read: true,
    },
    {
        id: '4',
        type: 'ai',
        title: 'Alfred Suggestion',
        description: "I noticed the concrete pour was delayed. Should I reschedule the tomorrow's team briefing?",
        time: 'Yesterday',
        read: true,
        actionLabel: 'Chat with Alfred'
    }
];

export default function NotificationsScreen() {
    const router = useRouter();
    const { startNewChat, sendMessage } = useChat();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const handleAction = async (item: Notification) => {
        if (item.type === 'ai' || item.actionLabel?.includes('Alfred')) {
            // Logic to transition to chat
            startNewChat();
            router.replace('/(main)');

            // Optionally send an initial prompt based on the notification
            if (item.id === '1') {
                setTimeout(() => sendMessage("Tell me more about my 3 site visits today."), 500);
            } else if (item.id === '4') {
                setTimeout(() => sendMessage("Tell me about the concrete delay suggestion."), 500);
            }
        }
    };

    const renderIcon = (type: string) => {
        switch (type) {
            case 'ai': return <Ionicons name="sparkles" size={20} color="#8B5CF6" />;
            case 'alert': return <Ionicons name="warning" size={20} color="#EF4444" />;
            default: return <Ionicons name="notifications" size={20} color="#71717A" />;
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={[styles.card, !item.read && styles.unreadCard]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, styles[`${item.type}Icon`]]}>
                    {renderIcon(item.type)}
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
            </View>

            <Text style={styles.itemDescription}>{item.description}</Text>

            {item.actionLabel && (
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleAction(item)}
                >
                    <Text style={styles.actionText}>{item.actionLabel}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#09090B" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <TouchableOpacity onPress={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>
                    <Text style={styles.markRead}>Mark all as read</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color="#E4E4E7" />
                        <Text style={styles.emptyTitle}>All caught up!</Text>
                        <Text style={styles.emptyDescription}>No new notifications for now.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles: any = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#09090B',
    },
    markRead: {
        fontSize: 14,
        color: '#71717A',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    unreadCard: {
        borderColor: '#09090B20',
        backgroundColor: '#FBFBFF', // Extremely subtle blue tint for unread
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    aiIcon: { backgroundColor: '#F5F3FF' },
    alertIcon: { backgroundColor: '#FEF2F2' },
    systemIcon: { backgroundColor: '#F4F4F5' },
    headerText: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#09090B',
    },
    itemTime: {
        fontSize: 12,
        color: '#71717A',
        marginTop: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
        marginLeft: 8,
    },
    itemDescription: {
        fontSize: 14,
        color: '#3F3F46',
        lineHeight: 20,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F4F4F5',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#09090B',
        marginRight: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
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
        marginTop: 8,
    },
});
