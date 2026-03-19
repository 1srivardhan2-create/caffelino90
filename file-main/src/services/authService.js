// Auth Service - Handles Google OAuth API calls

const API_BASE_URL = "https://caffelino90-9v4a.onrender.com/api";

/**
 * Send Google credential to backend for verification and JWT generation
 * @param {string} credential - The Google OAuth credential token
 * @param {string} loginRole - The intended role context ("user" or "cafe")
 * @returns {Promise<{token: string, user: object}>}
 */
export async function googleLogin(credential, loginRole) {
    const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential, loginRole }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Google login failed");
    }

    return data;
}

/**
 * Save JWT token to localStorage
 * @param {string} token
 */
export function saveToken(token) {
    localStorage.setItem("token", token);
}

/**
 * Get JWT token from localStorage
 * @returns {string|null}
 */
export function getToken() {
    return localStorage.getItem("token");
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken() {
    localStorage.removeItem("token");
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
    return !!getToken();
}
