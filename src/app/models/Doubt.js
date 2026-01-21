import mongoose from "mongoose";

const DoubtSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, { timestamps: true }
);

export default mongoose.models.Doubt || mongoose.model("Doubt", DoubtSchema);