
/**
 * Centralized configuration for the Field App.
 * In a real production app, these would be pulled from .env files 
 * via expo-constants (extra field in app.json).
 */
export const Config = {
    API: {
        BASE_URL: 'https://apepdcl-alfred.pathsetter.ai/api',
        TIMEOUT: 15000,
        CHAT_TIMEOUT: 30000,
    },
    STORAGE_KEYS: {
        TOKEN: 'auth_access_token',
        LAST_SESSION: 'last_chat_session_id',
    },
    UI: {
        SIGNATURE_GREEN: '#34A853',
        ERROR_RED: '#EF4444',
        ZINC_GRAY: '#71717A',
    }
};

export default Config;
