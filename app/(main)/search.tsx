import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SearchScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Image
                        source={require('../../assets/images/Alfred.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                    />
                    <View style={{ width: 32 }} /> {/* Balancing spacer */}
                </View>

                <ScrollView
                    style={styles.chatContainer}
                    contentContainerStyle={styles.chatContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.dateLabel}>YESTERDAY</Text>

                    {/* User Message */}
                    <View style={styles.messageWrapper}>
                        <View style={styles.userRoleContainer}>
                            <Text style={styles.roleLabel}>YOU</Text>
                        </View>
                        <View style={styles.userBubble}>
                            <Text style={styles.userText}>What is the status of the electrical wiring in Zone 3?</Text>
                        </View>
                    </View>

                    {/* AI Message */}
                    <View style={styles.aiMessageWrapper}>
                        <View style={styles.aiRoleContainer}>
                            <View style={[styles.avatarBox, { backgroundColor: '#E6F7ED' }]}>
                                <Ionicons name="bulb" size={14} color="#34A853" />
                            </View>
                            <Text style={styles.aiRoleLabel}>ALFRED AI</Text>
                        </View>

                        <View style={styles.aiResponseCard}>
                            <Text style={styles.aiIntroText}>
                                The electrical wiring in Zone 3 is currently ahead of schedule. Most conduit runs are completed. Here is the latest summary from the field report:
                            </Text>

                            {/* Structured Status Card */}
                            <View style={styles.statusInnerCard}>
                                <View style={styles.statusHeader}>
                                    <View style={styles.progressBadge}>
                                        <Text style={styles.progressBadgeText}>IN PROGRESS - 65%</Text>
                                    </View>
                                    <View style={styles.imagePlaceholder}>
                                        <Ionicons name="flash" size={24} color="#34A853" />
                                    </View>
                                </View>
                                <Text style={styles.statusTitle}>Electrical Wiring - Zone 3</Text>
                                <Text style={styles.statusSubtitle}>Last updated: 2 hours ago</Text>
                            </View>

                            {/* Quick Action Buttons */}
                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="document-text-outline" size={16} color="#444" />
                                    <Text style={styles.actionButtonText}>View Drawings</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="people-outline" size={16} color="#444" />
                                    <Text style={styles.actionButtonText}>Contact Supervisor</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.primaryActionButton}>
                                <Ionicons name="sync-outline" size={18} color="#34A853" />
                                <Text style={styles.primaryActionButtonText}>Update Progress</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                        <TouchableOpacity style={styles.pill}>
                            <Text style={styles.pillText}>Show today's safety checklist</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pill}>
                            <Text style={styles.pillText}>Who is the lead on Zone 5?</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={styles.inputRow}>
                        <View style={styles.searchBar}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Message Alfred..."
                                placeholderTextColor="#999"
                            />
                        </View>
                        <TouchableOpacity style={styles.sendButton}>
                            <Ionicons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 4,
    },
    headerLogo: {
        width: 100,
        height: 30,
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        padding: 20,
        paddingBottom: 40,
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#BBB',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: 1,
    },
    messageWrapper: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    userRoleContainer: {
        marginBottom: 4,
        marginRight: 0,
    },
    roleLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#8E8E93',
        letterSpacing: 0.5,
        textAlign: 'right',
    },
    userBubble: {
        backgroundColor: '#1890FF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderTopRightRadius: 4,
        maxWidth: '85%',
        marginRight: 0,
    },
    userText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 20,
    },
    userAvatar: {
        position: 'absolute',
        right: -40,
        bottom: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#CBD5E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiMessageWrapper: {
        marginBottom: 24,
    },
    aiRoleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    aiRoleLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#8E8E93',
        letterSpacing: 0.5,
    },
    aiResponseCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        borderTopLeftRadius: 4,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    aiIntroText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 16,
    },
    statusInnerCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressBadge: {
        backgroundColor: '#E6F4FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    progressBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1890FF',
    },
    imagePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    statusSubtitle: {
        fontSize: 12,
        color: '#999',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#444',
    },
    primaryActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E6F7ED',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    primaryActionButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#34A853',
    },
    inputSection: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    pillsScroll: {
        marginBottom: 12,
    },
    pill: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EEE',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    pillText: {
        fontSize: 13,
        color: '#444',
        fontWeight: '500',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 50,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
    },
    attachButton: {
        padding: 4,
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1890FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1890FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
});
