// Meetup Service - Handles meetup-related API calls

const API_BASE_URL = "https://caffelino90-9v4a.onrender.com/api/meetups";

/**
 * Get all active meetups for a specific user from the backend
 * @param {string} userId - The user ID to fetch meetups for
 * @returns {Promise<{success: boolean, meetups: any[]}>}
 */
export async function getActiveMeetups(userId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/active/${userId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch active meetups");
        }

        return data;
    } catch (error: any) {
        console.error("getActiveMeetups Error:", error);
        return { success: false, meetups: [], error: error.message };
    }
}

/**
 * Get all meetups the current user is a member of
 * @param {string} userId - The user ID to fetch meetups for
 * @returns {Promise<{success: boolean, meetups: any[]}>}
 */
export async function getMyMeetups(userId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/my?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch your meetups");
        }

        return data;
    } catch (error: any) {
        console.error("getMyMeetups Error:", error);
        return { success: false, meetups: [], error: error.message };
    }
}

/**
 * Leave or delete a meetup
 * @param {string} meetupId - The meetup ID
 * @param {string} userId - The user ID leaving the meetup
 * @returns {Promise<{success: boolean, message: string, deleted?: boolean}>}
 */
export async function leaveMeetup(meetupId: string, userId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ meetupId, userId }),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to leave meetup");
        }

        return data;
    } catch (error: any) {
        console.error("leaveMeetup Error:", error);
        return { success: false, error: error.message };
    }
}
