// ─── User Controller (Placeholder) ──────────────────────────────
// TODO: Implement user authentication and profile management
//
// Future endpoints:
//   - register(req, res)        → Create new user account (bcrypt hash)
//   - login(req, res)           → Authenticate user, return JWT
//   - getProfile(req, res)      → Get user profile details
//   - updateProfile(req, res)   → Update user profile & preferences
//   - createGroup(req, res)     → Create a new group booking
//   - joinGroup(req, res)       → Join a group via join code
//   - voteForCafe(req, res)     → Cast vote for a cafe in a group
//   - addGroupItems(req, res)   → Add menu items to group booking
// ─────────────────────────────────────────────────────────────────

const User = require("../models/User/User");

// ─── Update User Profile ─────────────────────────────────────────
// PUT /api/user/profile/:userId
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profileData = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        if (profileData.firstName) user.firstName = profileData.firstName;
        if (profileData.lastName) user.lastName = profileData.lastName;
        if (profileData.gender) user.gender = profileData.gender;
        if (profileData.city) user.city = profileData.city;
        if (profileData.age) user.age = parseInt(profileData.age);
        if (profileData.mobileNumber) user.mobileNumber = profileData.mobileNumber;
        if (profileData.avatarId) user.avatarId = profileData.avatarId;
        if (profileData.username) user.username = profileData.username.trim();
        
        // Mark profile as complete when explicitly requested or all core fields present
        if (profileData.profileCompleted === true || profileData.markComplete === true) {
            user.profileCompleted = true;
        } else if (profileData.firstName && profileData.avatarId) {
            user.profileCompleted = true;
        }

        // Also update name to full name if firstName is provided
        if (profileData.firstName) {
            user.name = profileData.firstName + (profileData.lastName ? " " + profileData.lastName : "");
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                city: user.city,
                age: user.age,
                mobileNumber: user.mobileNumber,
                avatarId: user.avatarId,
                username: user.username,
                role: user.role,
                profileCompleted: user.profileCompleted
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error updating profile", error: error.message });
    }
};

module.exports = { updateProfile };
