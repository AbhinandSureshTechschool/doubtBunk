import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        videoUrl: {
            type: String
        },
        doubt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doubt",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, { timestamps: true }
);


export default mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);