import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
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
import Markdown from 'react-native-markdown-display';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const markdownStyles: any = {
    body: {
        fontSize: 15,
        color: '#3F3F46',
        lineHeight: 22,
    },
    strong: {
        fontWeight: 'bold',
        color: '#09090B',
    },
    link: {
        color: '#1890FF',
    },
    bullet_list: {
        marginTop: 10,
    },
    list_item: {
        marginBottom: 5,
    },
};

export default function HomeDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const {
        messages,
        isThinking,
        isLoadingHistory,
        suggestedQuestions,
        sendMessage
    } = useChat();

    const scrollRef = useRef<ScrollView>(null);
    const [image, setImage] = React.useState<string | null>(null);
    const [input, setInput] = React.useState('');

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }, [messages, isThinking]);

    const handleSend = async (customText?: string) => {
        const textToSend = customText || input;
        if (!textToSend.trim() || isThinking) return;

        if (!customText) setInput('');
        await sendMessage(textToSend);
    };

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
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
            >
                {isLoadingHistory ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#09090B" />
                        <Text style={styles.resumingText}>Resuming Conversation...</Text>
                    </View>
                ) : (
                    <>
                        <ScrollView
                            ref={scrollRef}
                            showsVerticalScrollIndicator={false}
                            style={styles.chatContainer}
                            contentContainerStyle={styles.chatContent}
                        >
                            <Text style={styles.dateLabel}>{currentDate}</Text>

                            {messages.map((msg, idx) => (
                                <View key={idx} style={msg.role === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper}>
                                    {msg.role === 'assistant' && (
                                        <View style={styles.aiRoleContainer}>
                                            <View style={styles.aiDot} />
                                            <Text style={styles.aiRoleLabel}>ALFRED</Text>
                                        </View>
                                    )}

                                    {msg.role === 'user' && (
                                        <View style={styles.userRoleContainer}>
                                            <Text style={styles.userRoleLabel}>YOU</Text>
                                        </View>
                                    )}

                                    <View style={msg.role === 'user' ? styles.userBubble : styles.aiResponseCard}>
                                        {msg.role === 'assistant' ? (
                                            <View>
                                                <Markdown style={markdownStyles}>
                                                    {msg.content}
                                                </Markdown>

                                                {msg.sources && msg.sources.length > 0 && (
                                                    <View style={styles.sourcesContainer}>
                                                        <Text style={styles.sourcesTitle}>Sources:</Text>
                                                        {msg.sources.map((s: any, sIdx: number) => (
                                                            <Text key={sIdx} style={styles.sourceItem}>
                                                                • {s.metadata?.file_name || s.text}
                                                            </Text>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        ) : (
                                            <Text style={styles.userText}>{msg.content}</Text>
                                        )}
                                    </View>
                                </View>
                            ))}

                            {isThinking && (
                                <View style={styles.aiMessageWrapper}>
                                    <View style={styles.aiRoleContainer}>
                                        <View style={styles.aiDot} />
                                        <Text style={styles.aiRoleLabel}>ALFRED IS THINKING...</Text>
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        {/* Suggested Questions Pills */}
                        {suggestedQuestions.length > 0 && !isThinking && (
                            <View style={styles.suggestedContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestedScroll}>
                                    {suggestedQuestions.map((q, i) => (
                                        <TouchableOpacity key={i} style={styles.suggestedPill} onPress={() => handleSend(q)}>
                                            <Text style={styles.suggestedPillText}>{q}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </>
                )}

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
                            value={input}
                            onChangeText={setInput}
                            returnKeyType="send"
                            onSubmitEditing={() => handleSend()}
                            multiline
                            blurOnSubmit={false}
                        />

                        <TouchableOpacity activeOpacity={0.8} style={styles.floatingSendBtn} onPress={() => handleSend()}>
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
    userMessageWrapper: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    userRoleContainer: {
        marginBottom: 4,
    },
    userRoleLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A1A1AA',
        letterSpacing: 0.5,
    },
    userBubble: {
        backgroundColor: '#09090B',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        borderTopRightRadius: 4,
        maxWidth: '85%',
    },
    userText: {
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 20,
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        padding: 16,
        paddingBottom: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resumingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#71717A',
        fontWeight: '500',
    },
    suggestedContainer: {
        paddingBottom: 8,
        backgroundColor: '#FAFAFA',
    },
    suggestedScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    suggestedPill: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E4E4E7',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    suggestedPillText: {
        fontSize: 13,
        color: '#3F3F46',
        fontWeight: '500',
    },
    sourcesContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    sourcesTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#71717A',
        marginBottom: 4,
    },
    sourceItem: {
        fontSize: 12,
        color: '#71717A',
        marginBottom: 2,
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#BBB',
        textAlign: 'center',
        paddingTop: 10,
        marginBottom: 20,
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
