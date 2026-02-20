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

                {/* Floating Chat Input — ChatGPT style */}
                <View style={styles.floatingInputContainer}>
                    <View style={styles.floatingBar}>
                        <TouchableOpacity onPress={handleCamera} activeOpacity={0.7} style={styles.floatingIconBtn}>
                            <Ionicons name="camera-outline" size={20} color="#71717A" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.floatingTextInput}
                            placeholder="Message Alfred..."
                            placeholderTextColor="#A1A1AA"
                            returnKeyType="send"
                            multiline
                        />

                        <TouchableOpacity activeOpacity={0.8} style={styles.floatingSendBtn}>
                            <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
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
        backgroundColor: '#FAFAFA',
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
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    aiGreeting: {
        fontSize: 17,
        fontWeight: '600',
        color: '#09090B',
        marginBottom: 6,
    },
    aiIntroText: {
        fontSize: 14,
        color: '#3F3F46',
        lineHeight: 20,
        marginBottom: 16,
    },
    iosSectionHeader: {
        marginBottom: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    iosSectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#A1A1AA',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
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
        fontSize: 14,
        fontWeight: '500',
        color: '#09090B',
    },
    iosListSubtitle: {
        fontSize: 12,
        color: '#71717A',
        marginTop: 1,
    },
    iosStartBadge: {
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    iosStartBadgeText: {
        color: '#16A34A',
        fontSize: 11,
        fontWeight: '600',
    },
    iosActiveText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#16A34A',
    },
    floatingInputContainer: {
        paddingHorizontal: 14,
        paddingBottom: Platform.OS === 'android' ? 14 : 28,
        paddingTop: 8,
        backgroundColor: 'transparent',
    },
    floatingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    floatingIconBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingTextInput: {
        flex: 1,
        fontSize: 15,
        color: '#09090B',
        maxHeight: 100,
        paddingVertical: 4,
    },
    floatingSendBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#09090B',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
