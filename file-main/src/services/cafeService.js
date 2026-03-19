// Cafe Service - Handles cafe registration, fetching, and verification API calls

const API_BASE_URL = "https://caffelino90-9v4a.onrender.com/api";

/**
 * Register a new cafe (simplified, no file uploads)
 */
export async function registerCafe({ ownerId, cafeName, establishmentType, location, latitude, longitude, tables, email, managerName, phone, opening_hours, profilePicture, averageCostPerPerson, description, cafePhotos }) {
    const response = await fetch(`${API_BASE_URL}/cafe/register-simple`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ownerId, cafeName, establishmentType, location, latitude, longitude, tables, email, managerName, phone, opening_hours, profilePicture, averageCostPerPerson, description, cafePhotos }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || "Cafe registration failed");
    }

    return data;
}

/**
 * Get cafe for a specific owner
 * @param {string} ownerId - The user's MongoDB _id
 * @param {string} email - Optional: The user's email address for legacy fallback
 * @returns {Promise<{success: boolean, cafe: object} | null>}
 */
export async function getMyCafe(ownerId, email = null) {
    try {
        let url = `${API_BASE_URL}/cafe/my-cafe/${ownerId}`;
        if (email) {
            url += `?email=${encodeURIComponent(email)}`;
        }
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 404) {
            return null; // No cafe found
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch cafe");
        }

        return data;
    } catch (error) {
        console.error("getMyCafe error:", error);
        return null;
    }
}

/**
 * Verify/approve a cafe (admin action)
 * @param {string} cafeId - The cafe's MongoDB _id
 */
export async function verifyCafe(cafeId) {
    const response = await fetch(`${API_BASE_URL}/cafe/verify/${cafeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Cafe verification failed");
    }

    return data;
}

/**
 * Get all approved cafes (public, for user-facing pages)
 * @returns {Promise<{success: boolean, cafes: object[]}>}
 */
export async function getApprovedCafes() {
    try {
        const response = await fetch(`${API_BASE_URL}/cafe/approved`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch approved cafes");
        }

        return data;
    } catch (error) {
        console.error("getApprovedCafes error:", error);
        return { success: false, cafes: [] };
    }
}

/**
 * Update cafe photos and/or profile picture (from dashboard)
 * @param {string} cafeId - The cafe's MongoDB _id
 * @param {object} imageData - Object containing cafePhotos (array) and/or profilePicture (string)
 */
export async function updateCafePhotos(cafeId, { cafePhotos, profilePicture }) {
    try {
        const response = await fetch(`${API_BASE_URL}/cafe/update-photos/${cafeId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cafePhotos, profilePicture }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update cafe images");
        }

        return data;
    } catch (error) {
        console.error("updateCafePhotos error:", error);
        throw error;
    }
}

