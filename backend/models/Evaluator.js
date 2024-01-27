import mongoose from "mongoose";

const EvaluatorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        questionPaper: {
            type: Array,
            required: true,
        },
        answerKey: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Evaluator = mongoose.model("Evaluator", EvaluatorSchema);

export default Evaluator;