import express from "express";
import joi from "joi";
import { validate } from "../middlewares/validate.js";
import Evaluator from "../models/Evaluator.js";
import Limits from "../models/Limits.js";

const router = express.Router();

router.get("/", validate, async (req, res) => {
    const limits = await Limits.findOne({ userId: req.user._id });

    const evaluators = await Evaluator.find({ userId: req.user._id }).populate("classId");
    return res.send({ evaluators, limit: limits.evaluatorLimit });
});

router.post("/new", validate, async (req, res) => {
    const schema = joi.object({
        title: joi.string().required(),
        description: joi.string().allow(""),
        classId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluators = await Evaluator.find({ userId: req.user._id });

        const limits = await Limits.findOne({ userId: req.user._id });

        if (evaluators.length >= limits.evaluatorLimit) {
            return res.status(400).send("You have reached the limit of evaluators you can create. Please upgrade your plan to create more evaluators.");
        }

        const newEvaluator = new Evaluator({
            userId: req.user._id,
            classId: data.classId,
            title: data.title,
            description: data.description,
            questionPapers: [],
            answerKeys: [],
            extraPrompt: "",
        });

        await newEvaluator.save();
        return res.send(newEvaluator);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

export default router;