const BASE_URL = 'https://apepdcl-alfred.pathsetter.ai/api';

export interface ChatSource {
    id: string;
    text: string;
    score: number;
    metadata: {
        file_name: string;
    };
}

export interface ChatResponse {
    success: boolean;
    session_id: string;
    query: string;
    answer: string;
    sources: ChatSource[];
    total_sources: number;
    processing_time: number;
    suggested_questions: string[];
}

export interface ChatSession {
    session_id: string;
    first_question?: string;
    created_at?: string;
}

export interface SessionsResponse {
    success: boolean;
    sessions: ChatSession[];
}

/** 
 * Native-friendly request wrapper to bypass Android fetch polyfill issues 
 */
function xhrRequest(
    method: string,
    url: string,
    body?: string,
    token?: string
): Promise<{ status: number; data: string }> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.setRequestHeader('Content-Type', 'application/json');
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.onload = () => resolve({ status: xhr.status, data: xhr.responseText });
        xhr.onerror = () => reject(new Error('Chat network request failed'));
        xhr.ontimeout = () => reject(new Error('Chat request timed out'));

        xhr.timeout = 30000; // Chat can take a while (13s+ in logs)
        xhr.send(body ?? null);
    });
}

/**
 * Sends a message to the Alfred AI assistant.
 */
export async function sendChatMessage(
    query: string,
    token: string,
    sessionId?: string
): Promise<ChatResponse> {
    const url = `${BASE_URL}/search/chat/conversation`;
    const body = JSON.stringify({
        query,
        session_id: sessionId || null,
        project_id: "", // Empty string triggers global organization-wide search
        include_sources: true,
        limit: 5
    });

    console.log('[chatService] Sending query:', query);

    const { status, data } = await xhrRequest('POST', url, body, token);

    console.log('[chatService] Response Status:', status);
    console.log('[chatService] Raw Response:', data);

    if (status < 200 || status >= 300) {
        let errorMessage = `Chat error (${status})`;
        try {
            const parsed = JSON.parse(data);
            errorMessage = parsed.detail || errorMessage;
        } catch (e) { }
        throw new Error(errorMessage);
    }

    return JSON.parse(data) as ChatResponse;
}

/**
 * Fetches the list of past chat sessions.
 */
export async function fetchSessionsApi(token: string): Promise<ChatSession[]> {
    const url = `${BASE_URL}/search/chat/sessions`;

    console.log('[chatService] Fetching sessions...');

    const { status, data } = await xhrRequest('GET', url, undefined, token);

    if (status < 200 || status >= 300) {
        throw new Error(`Failed to fetch sessions (${status})`);
    }

    const parsed = JSON.parse(data) as SessionsResponse;
    return parsed.sessions || [];
}

/**
 * Fetches the full message history for a specific session.
 */
export async function fetchSessionMessagesApi(token: string, sessionId: string): Promise<any[]> {
    const url = `${BASE_URL}/search/chat/sessions/${sessionId}/messages`;

    console.log(`[chatService] Fetching messages for session: ${sessionId}`);

    const { status, data } = await xhrRequest('GET', url, undefined, token);

    if (status < 200 || status >= 300) {
        throw new Error(`Failed to fetch messages (${status})`);
    }

    const parsed = JSON.parse(data);
    // The backend typically returns a list of messages
    return parsed.messages || parsed || [];
}
