import mongoose from "mongoose";

const EvaluatorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
            default: "",
        },
        questionPapers: {
            type: Array,
            required: true,
        },
        answerKeys: {
            type: Array,
            required: true,
        },
        extraPrompt: {
            type: String,
            required: false,
            default: "",
        }
    },
    {
        timestamps: true,
    }
);

const Evaluator = mongoose.model("Evaluator", EvaluatorSchema);

export default Evaluator;