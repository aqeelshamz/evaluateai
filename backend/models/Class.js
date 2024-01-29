import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
    {
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
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
            }
        ],
        createdBy: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const Class = mongoose.model("Class", ClassSchema);

export default Class;