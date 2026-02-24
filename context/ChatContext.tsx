import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ChatSource, fetchSessionMessagesApi, sendChatMessage } from '../services/chatService';
import { useAuth } from './AuthContext';

const LAST_SESSION_KEY = 'last_chat_session_id';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: ChatSource[];
}

interface ChatContextValue {
    messages: Message[];
    isThinking: boolean;
    isLoadingHistory: boolean;
    sessionId: string | null;
    suggestedQuestions: string[];
    sendMessage: (text: string) => Promise<void>;
    startNewChat: () => void;
    loadSession: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { token, user } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

    // On Startup: Restore last session if exists
    useEffect(() => {
        if (!token) {
            // Cleanup state and storage on logout
            setMessages([]);
            setSessionId(null);
            setSuggestedQuestions([]);
            SecureStore.deleteItemAsync(LAST_SESSION_KEY).catch(() => { });
            return;
        }

        async function restoreSession() {
            try {
                const savedId = await SecureStore.getItemAsync(LAST_SESSION_KEY);
                if (savedId) {
                    await loadSession(savedId);
                }
            } catch (err) {
                console.error('[ChatContext] Restore session failed:', err);
            }
        }
        restoreSession();
    }, [token]);

    // Initialize with a welcome message if empty and not loading
    useEffect(() => {
        if (messages.length === 0 && user && !isLoadingHistory && !sessionId) {
            setMessages([
                {
                    role: 'assistant',
                    content: `Good Morning, ${user.name.split(' ')[0]}! 👋\n\nI'm ready to help you with your site today. You can ask me anything about documents, projects, or status updates.`
                }
            ]);
        }
    }, [user, messages.length, isLoadingHistory, sessionId]);

    const startNewChat = useCallback(() => {
        setSessionId(null);
        SecureStore.deleteItemAsync(LAST_SESSION_KEY).catch(() => { });
        setSuggestedQuestions([]);
        setMessages([
            {
                role: 'assistant',
                content: `Good Morning, ${user?.name?.split(' ')[0] || 'Maruthi'}! 👋\n\nI've started a fresh session for you. How can I help?`
            }
        ]);
    }, [user]);

    const loadSession = useCallback(async (id: string) => {
        setIsLoadingHistory(true);
        setMessages([]); // Clear immediately to prevent flickering
        setSessionId(id);
        await SecureStore.setItemAsync(LAST_SESSION_KEY, id).catch(() => { });

        try {
            const history = await fetchSessionMessagesApi(token || '', id);

            // Map API response to local Message format
            const mappedHistory = history.map((m: any) => ({
                role: m.role,
                content: m.content || m.query || m.answer || '',
                sources: m.sources
            }));

            setMessages(mappedHistory);
            setSuggestedQuestions([]);
        } catch (err: any) {
            console.error('[ChatContext] Error loading session:', err);
            // If session is not found (404), clear the persistence to prevent repeated errors
            if (err?.status === 404 || err?.message?.includes('404')) {
                SecureStore.deleteItemAsync(LAST_SESSION_KEY).catch(() => { });
                setSessionId(null);
                // Fallback to fresh state
                setMessages([]);
            }
        } finally {
            setIsLoadingHistory(false);
        }
    }, [token]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isThinking) return;

        // 1. Add user message
        const userMsg: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        try {
            // 2. API Call
            const response = await sendChatMessage(text, token || '', sessionId || undefined);

            // 3. Update state
            const aiMsg: Message = {
                role: 'assistant',
                content: response.answer,
                sources: response.sources
            };

            setMessages(prev => [...prev, aiMsg]);
            setSessionId(response.session_id);
            await SecureStore.setItemAsync(LAST_SESSION_KEY, response.session_id).catch(() => { });
            setSuggestedQuestions(response.suggested_questions || []);

        } catch (err: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Sorry, I encountered an error: ${err?.message || 'Please try again later.'}`
            }]);
        } finally {
            setIsThinking(false);
        }
    }, [token, sessionId, isThinking]);

    return (
        <ChatContext.Provider value={{
            messages,
            isThinking,
            isLoadingHistory,
            sessionId,
            suggestedQuestions,
            sendMessage,
            startNewChat,
            loadSession
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
