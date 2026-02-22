const BASE_URL = 'https://apepdcl-alfred.pathsetter.ai/api';

export interface AuthTokens {
    access_token: string;
    token_type: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    role_id: string;
    is_active: boolean;
    organization_id: string;
    is_regulator: boolean;
    org_legal_name: string;
}

/** Promise wrapper around XMLHttpRequest — bypasses RN fetch polyfill issues */
function xhrRequest(
    method: string,
    url: string,
    body?: string,
    headers?: Record<string, string>
): Promise<{ status: number; data: string }> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        if (headers) {
            Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
        }

        xhr.onload = () => resolve({ status: xhr.status, data: xhr.responseText });
        xhr.onerror = () => reject(new Error('Network request failed'));
        xhr.ontimeout = () => reject(new Error('Request timed out'));

        xhr.timeout = 15000; // 15s timeout
        xhr.send(body ?? null);
    });
}

/**
 * POST /auth/login
 * Uses OAuth2 password flow with form-encoded body.
 */
export async function loginApi(email: string, password: string): Promise<AuthTokens> {
    // ── Connectivity pre-flight ─────────────────────────────────────────────
    try {
        const test = await xhrRequest('GET', 'https://api.ipify.org?format=json');
        console.log('[authService] ✅ pre-flight OK — device IP:', test.data);
    } catch (e: any) {
        console.error('[authService] ❌ pre-flight FAILED — ALL https broken:', e?.message);
    }
    // ───────────────────────────────────────────────────────────────────────

    const bodyStr =
        `grant_type=password` +
        `&username=${encodeURIComponent(email)}` +
        `&password=${encodeURIComponent(password)}` +
        `&scope=&client_id=&client_secret=`;

    console.log('[authService] loginApi → hitting:', `${BASE_URL}/auth/login`);

    const { status, data } = await xhrRequest(
        'POST',
        `${BASE_URL}/auth/login`,
        bodyStr,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
    );

    console.log('[authService] login status:', status);
    console.log('[authService] login response:', data);

    const parsed = JSON.parse(data);

    if (status < 200 || status >= 300) {
        const message = parsed?.detail || `Login failed (${status})`;
        throw new Error(message);
    }

    return parsed as AuthTokens;
}

/**
 * GET /auth/me
 * Fetches the current user's profile using the bearer token.
 */
export async function fetchMeApi(token: string): Promise<AuthUser> {
    console.log('[authService] fetchMeApi → calling /auth/me');

    const { status, data } = await xhrRequest(
        'GET',
        `${BASE_URL}/auth/me`,
        undefined,
        {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        }
    );

    console.log('[authService] me status:', status);

    if (status < 200 || status >= 300) {
        throw new Error(`Failed to fetch user (${status})`);
    }

    return JSON.parse(data) as AuthUser;
}
