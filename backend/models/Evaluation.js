import mongoose from "mongoose";

const EvaluatorSchema = new mongoose.Schema(
    {
        evaluatorId: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
        data: {
            type: Object,
            required: true
        },
        answerSheets: {
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