import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    ListRenderItemInfo,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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
    const { user } = useAuth();
    const {
        messages,
        isThinking,
        isLoadingHistory,
        suggestedQuestions,
        sendMessage
    } = useChat();

    const flatListRef = useRef<FlatList>(null);
    const [image, setImage] = React.useState<string | null>(null);
    const [input, setInput] = React.useState('');

    // Auto-scroll logic for FlatList
    const scrollToBottom = useCallback(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 200);
        }
    }, [messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking, scrollToBottom]);

    const handleSend = async (customText?: string) => {
        const textToSend = customText || input;
        if (!textToSend.trim() || isThinking) return;

        if (!customText) setInput('');
        await sendMessage(textToSend);
    };

    const currentDate = useMemo(() => new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }), []);

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

    const renderMessageItem = useCallback(({ item, index }: ListRenderItemInfo<any>) => {
        const isUser = item.role === 'user';
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <View key={`msg-${index}`} style={[styles.messageWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <View style={[styles.tail, isUser ? styles.userTail : styles.aiTail]} />

                    {!isUser && (
                        <Text style={styles.aiName}>ALFRED</Text>
                    )}

                    {item.role === 'assistant' ? (
                        <View style={styles.contentContainer}>
                            <Markdown style={markdownStyles}>
                                {item.content}
                            </Markdown>

                            {item.sources && item.sources.length > 0 && (
                                <View style={styles.sourcesContainer}>
                                    <View style={styles.sourcesDivider} />
                                    <Text style={styles.sourcesTitle}>SOURCES</Text>
                                    {item.sources.map((s: any, sIdx: number) => (
                                        <Text key={sIdx} style={styles.sourceItem}>
                                            • {s.metadata?.file_name || s.text}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    ) : (
                        <Text style={styles.userText}>{item.content}</Text>
                    )}

                    <View style={styles.bubbleFooter}>
                        <Text style={styles.timestamp}>{timestamp}</Text>
                        {isUser && (
                            <Ionicons name="checkmark-done" size={14} color="#53BDEB" style={{ marginLeft: 4 }} />
                        )}
                    </View>
                </View>
            </View>
        );
    }, []);

    const ListHeader = useMemo(() => (
        <View style={styles.dateSeparator}>
            <View style={styles.datePill}>
                <Text style={styles.dateText}>{currentDate}</Text>
            </View>
        </View>
    ), [currentDate]);

    const ListFooter = useMemo(() => (
        <>
            {isThinking && (
                <View style={styles.aiWrapper}>
                    <View style={[styles.bubble, styles.aiBubble]}>
                        <View style={[styles.tail, styles.aiTail]} />
                        <Text style={styles.aiName}>ALFRED</Text>
                        <View style={styles.thinkingContainer}>
                            <ActivityIndicator size="small" color="#34A853" />
                            <Text style={styles.thinkingText}>Alfred is thinking...</Text>
                        </View>
                    </View>
                </View>
            )}
            <View style={{ height: 20 }} />
        </>
    ), [isThinking]);

    return (
        <View style={styles.container}>
            <View style={styles.wallpaperOverlay} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 115 : 90}
            >
                {isLoadingHistory ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#34A853" />
                        <Text style={styles.resumingText}>Resuming Conversation...</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(_, index) => `msg-${index}`}
                        renderItem={renderMessageItem}
                        ListHeaderComponent={ListHeader}
                        ListFooterComponent={ListFooter}
                        style={styles.chatContainer}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={15}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={Platform.OS === 'android'}
                    />
                )}

                {/* Suggested Questions & Input */}
                <View>
                    {suggestedQuestions.length > 0 && !isThinking && !isLoadingHistory && (
                        <View style={styles.suggestedContainer}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.suggestedScroll}
                                data={suggestedQuestions}
                                keyExtractor={(item, index) => `sq-${index}`}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.suggestedPill} onPress={() => handleSend(item)}>
                                        <Text style={styles.suggestedPillText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}

                    <View style={styles.inputBarArea}>
                        <View style={styles.inputBarBackground}>
                            <TouchableOpacity onPress={handleCamera} style={styles.inputBarIcon}>
                                <Ionicons name="camera-outline" size={24} color="#71717A" />
                            </TouchableOpacity>

                            <TextInput
                                style={[styles.textInput, { maxHeight: 100 }]}
                                placeholder="Message Alfred..."
                                placeholderTextColor="#94A3B8"
                                value={input}
                                onChangeText={setInput}
                                multiline
                            />

                            <TouchableOpacity
                                style={[styles.sendCircle, !input.trim() && styles.sendCircleDisabled]}
                                onPress={() => handleSend()}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5DDD5',
    },
    wallpaperOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#E5DDD5',
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    messageWrapper: {
        marginBottom: 8,
        width: '100%',
        flexDirection: 'row',
    },
    userWrapper: {
        justifyContent: 'flex-end',
    },
    aiWrapper: {
        justifyContent: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        maxWidth: '85%',
        minWidth: 80,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    userBubble: {
        backgroundColor: '#DCF8C6',
        borderTopRightRadius: 0,
    },
    aiBubble: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 0,
    },
    tail: {
        position: 'absolute',
        top: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    userTail: {
        right: -5,
        borderBottomColor: '#DCF8C6',
        transform: [{ rotate: '90deg' }],
    },
    aiTail: {
        left: -5,
        borderBottomColor: '#FFFFFF',
        transform: [{ rotate: '-90deg' }],
    },
    userText: {
        fontSize: 16,
        color: '#111',
        lineHeight: 20,
    },
    aiName: {
        fontSize: 11,
        fontWeight: '700',
        color: '#34A853',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    contentContainer: {
        marginBottom: 4,
    },
    bubbleFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 2,
    },
    timestamp: {
        fontSize: 11,
        color: '#8E8E93',
    },
    dateSeparator: {
        alignItems: 'center',
        marginVertical: 14,
    },
    datePill: {
        backgroundColor: '#D1E4FC',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#54656F',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    suggestedContainer: {
        paddingVertical: 8,
        backgroundColor: 'rgba(229, 221, 213, 0.9)',
    },
    suggestedScroll: {
        paddingHorizontal: 10,
        gap: 8,
    },
    suggestedPill: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    suggestedPillText: {
        fontSize: 13,
        color: '#3F3F46',
        fontWeight: '500',
    },
    inputBarArea: {
        padding: 8,
        backgroundColor: '#E5DDD5',
    },
    inputBarBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    inputBarIcon: {
        padding: 4,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#111',
        paddingVertical: 6,
    },
    sendCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#34A853',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendCircleDisabled: {
        backgroundColor: '#A1A1AA',
    },
    thinkingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 4,
    },
    thinkingText: {
        fontSize: 14,
        color: '#71717A',
        fontStyle: 'italic',
    },
    sourcesContainer: {
        marginTop: 8,
    },
    sourcesDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 8,
    },
    sourcesTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 4,
    },
    sourceItem: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5DDD5',
    },
    resumingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#71717A',
        fontWeight: '500',
    },
});
