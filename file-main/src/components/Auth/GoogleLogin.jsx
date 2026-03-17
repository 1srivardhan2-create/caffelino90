import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { googleLogin as googleLoginAPI, saveToken } from "../../services/authService";

/**
 * GoogleLoginButton Component
 *
 * Renders "Continue with Google" button using @react-oauth/google.
 * On success: decodes token, sends to backend, saves JWT, and calls onLoginSuccess.
 *
 * Props:
 *   - onLoginSuccess(user): Called with user object after successful login
 *   - onLoginError(error): Called with error message on failure
 *   - onProcessing(isProcessing): Called with processing state changes
 */
export default function GoogleLoginButton({ onLoginSuccess, onLoginError, onProcessing, loginRole = "user" }) {
    const handleSuccess = async (credentialResponse) => {
        try {
            if (onProcessing) onProcessing(true);

            const credential = credentialResponse.credential;

            // Decode the JWT to extract user info (for immediate UI use)
            const decoded = jwtDecode(credential);
            const { sub: googleId, name, email, picture } = decoded;

            console.log("Google Login - Decoded user:", { googleId, name, email, picture });

            // Send to backend for verification and JWT generation
            try {
                // Pass loginRole to backend to handle role-based logic correctly
                const response = await googleLoginAPI(credential, loginRole);

                // Save the backend JWT token
                saveToken(response.token);

                // Call success callback with user data from backend
                if (onLoginSuccess) {
                    const userData = {
                        id: response.user.id || response.user.googleId,
                        googleId: response.user.googleId || googleId,
                        name: response.user.name || name,
                        email: response.user.email || email,
                        photo: response.user.picture || picture,
                        role: response.user.role || loginRole,
                        profileCompleted: response.user.profileCompleted || false,
                        verified: true,
                        authProvider: "google",
                        age: 0,
                        gender: "",
                        city: "",
                        interests: [],
                    };
                    // Save user ID for cafe registration
                    localStorage.setItem('myCafeOwnerId', userData.id);
                    localStorage.setItem('userId', userData.id);
                    onLoginSuccess(userData);
                }
            } catch (apiError) {
                console.warn("Backend API unavailable, using local auth:", apiError.message);

                // Fallback: use decoded Google token data directly (works without backend)
                const fallbackUser = {
                    id: "google_" + email.replace(/[^a-zA-Z0-9]/g, "_"),
                    googleId: googleId,
                    name: name,
                    email: email,
                    photo: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=be9d80&color=fff`,
                    verified: true,
                    profileCompleted: false,
                    authProvider: "google",
                    age: 0,
                    gender: "",
                    city: "",
                    interests: [],
                };

                // Save to localStorage for saved accounts feature
                const existingUsers = JSON.parse(localStorage.getItem("google_users") || "{}");
                existingUsers[fallbackUser.id] = fallbackUser;
                localStorage.setItem("google_users", JSON.stringify(existingUsers));
                localStorage.setItem('myCafeOwnerId', fallbackUser.id);
                localStorage.setItem('userId', fallbackUser.id);

                if (onLoginSuccess) {
                    onLoginSuccess(fallbackUser);
                }
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            if (onLoginError) {
                onLoginError(error.message || "Login failed. Please try again.");
            }
        } finally {
            if (onProcessing) onProcessing(false);
        }
    };

    const handleError = () => {
        console.error("Google Login Failed");
        if (onLoginError) {
            onLoginError("Google login failed. Please try again.");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="320"
                logo_alignment="left"
            />
        </div>
    );
}
