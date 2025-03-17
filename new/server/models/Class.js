import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        students: [
            {
                rollNo: {
                    type: Number
                },
                name: {
                    type: String
                },
                email: {
                    type: String
                }
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Class = mongoose.model("Class", ClassSchema);

export default Class;