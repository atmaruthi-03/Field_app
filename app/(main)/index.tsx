import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeDashboard() {
    const router = useRouter();
    const [image, setImage] = React.useState<string | null>(null);

    const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const handleCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Alfred needs camera access to capture site updates.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            Alert.alert('Photo Captured', 'AI is drafting your update for Zone 3...');
        }
    };

    return (
        <View style={styles.container}>

            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.chatContainer}
                    contentContainerStyle={styles.chatContent}
                >
                    <Text style={styles.dateLabel}>TODAY</Text>

                    {/* AI Proactive Introduction */}
                    <View style={styles.aiMessageWrapper}>
                        <View style={styles.aiRoleContainer}>
                            <View style={styles.aiDot} />
                            <Text style={styles.aiRoleLabel}>ALFRED</Text>
                        </View>

                        <View style={styles.aiResponseCard}>
                            <Text style={styles.aiGreeting}>Good Morning, Maruthi! 👋</Text>
                            <Text style={styles.aiIntroText}>
                                Here are your top priorities for today at the North Block site. Which one would you like to start with?
                            </Text>

                            {/* Section: Daily Commitments (Embedded in Chat) */}
                            <View style={styles.iosSectionHeader}>
                                <Text style={styles.iosSectionTitle}>Daily Commitments</Text>
                            </View>

                            <View style={styles.iosInsetGrouped}>
                                <TouchableOpacity style={styles.iosListItem}>
                                    <Ionicons name="ellipse-outline" size={20} color="#34A853" style={styles.iosStatusIcon} />
                                    <View style={styles.iosListContent}>
                                        <Text style={styles.iosListTitle}>Zone 3: North Block Rebar</Text>
                                        <Text style={styles.iosListSubtitle}>Reinforcement work (Floor 2)</Text>
                                    </View>
                                    <View style={styles.iosStartBadge}>
                                        <Text style={styles.iosStartBadgeText}>Start</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.iosListItem}>
                                    <Ionicons name="play-circle" size={20} color="#1890FF" style={styles.iosStatusIcon} />
                                    <View style={styles.iosListContent}>
                                        <Text style={styles.iosListTitle}>Zone 5: Plumbing Prep</Text>
                                        <Text style={styles.iosListSubtitle}>Wait for RFI reply (Drainage)</Text>
                                    </View>
                                    <Text style={styles.iosActiveText}>Active</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.iosListItem, { borderBottomWidth: 0 }]}>
                                    <Ionicons name="checkmark-circle" size={20} color="#52C41A" style={styles.iosStatusIcon} />
                                    <View style={styles.iosListContent}>
                                        <Text style={[styles.iosListTitle, { color: '#8E8E93', textDecorationLine: 'line-through' }]}>Daily Safety Briefing</Text>
                                        <Text style={styles.iosListSubtitle}>Completed at 08:15 AM</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Sticky Chat Input */}
                <View style={styles.inputSection}>
                    <View style={styles.inputRow}>
                        {/* Text Input area with integrated send icon */}
                        <View style={styles.searchBar}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Message Alfred..."
                                placeholderTextColor="#999"
                                returnKeyType="send"
                                multiline
                            />
                            <TouchableOpacity style={styles.sendIconInside} activeOpacity={0.7}>
                                <Ionicons name="send" size={22} color="#34A853" />
                            </TouchableOpacity>
                        </View>

                        {/* Camera Button (Main Action) */}
                        <TouchableOpacity style={styles.cameraButtonOutside} onPress={handleCamera} activeOpacity={0.8}>
                            <Ionicons name="camera" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        padding: 16,
        paddingBottom: 32,
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#BBB',
        textAlign: 'center',
        marginVertical: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    aiMessageWrapper: {
        marginBottom: 24,
    },
    aiDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#34A853',
        marginRight: 7,
    },
    aiRoleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    aiAvatarSmall: {
        width: 24,
        height: 24,
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
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    aiGreeting: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    aiIntroText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
        marginBottom: 20,
    },
    iosSectionHeader: {
        marginBottom: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    iosSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    iosInsetGrouped: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    iosListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EEE',
    },
    iosStatusIcon: {
        marginRight: 10,
    },
    iosListContent: {
        flex: 1,
    },
    iosListTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    iosListSubtitle: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 1,
    },
    iosStartBadge: {
        backgroundColor: '#34A853',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    iosStartBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    iosActiveText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#007AFF',
    },
    inputSection: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: Platform.OS === 'android' ? 20 : 24,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sendIconInside: {
        padding: 4,
        marginLeft: 8,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 48,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1A',
    },
    cameraButtonOutside: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#34A853',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#34A853',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
});
