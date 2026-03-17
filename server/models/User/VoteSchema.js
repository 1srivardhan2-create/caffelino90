const mongoose = require("mongoose");

const CafeVoteSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupAdmin",
            required: true,
        },
        cafe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cafe",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Triple compound unique index — one user can vote for each cafe only once per group
CafeVoteSchema.index({ group: 1, cafe: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("CafeVote", CafeVoteSchema);
