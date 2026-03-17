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
        
        // Mark profile as complete
        user.profileCompleted = true;

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
                email: user.email,
                profileCompleted: user.profileCompleted
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error updating profile", error: error.message });
    }
};

module.exports = { updateProfile };
