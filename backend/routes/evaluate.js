import joi from "joi";
import express from "express";
import { validate } from "../middlewares/validate.js";
import Evaluator from "../models/Evaluator.js";
import Limits from "../models/Limits.js";
import Evaluation from "../models/Evaluation.js";
import Class from "../models/Class.js";

const router = express.Router();

//EVALUATORS
router.get("/evaluators", validate, async (req, res) => {
    const evaluators = await Evaluator.find({ userId: req.user._id });
    return res.send({ evaluators: evaluators, user: { name: req.user.name, email: req.user.email, type: req.user.type } });
});

router.post("/evaluators/create", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
        title: joi.string().required(),
        questionPapers: joi.array().required(),
        answerKeys: joi.array().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const limits = await Limits.findOne({ userId: req.user._id });

        if (limits.evaluatorLimit <= 0) {
            return res.status(400).send("Evaluator limit exceeded");
        }

        const classData = await Class.findById(data.classId);
        if (!classData) {
            return res.status(400).send("Class not found");
        }

        limits.evaluatorLimit -= 1;

        await limits.save();

        const evaluator = new Evaluator({
            userId: req.user._id,
            classId: data.classId,
            title: data.title,
            questionPapers: data.questionPapers,
            answerKeys: data.answerKeys,
        });

        await evaluator.save();

        return res.send(evaluator);
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

router.post("/evaluators/delete", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const limits = await Limits.findOne({ userId: req.user._id });

        limits.evaluatorLimit += 1;

        await limits.save();

        await Evaluator.findByIdAndDelete(data.evaluatorId);

        return res.send("Evaluator deleted");
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluators/update", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        title: joi.string().required(),
        questionPapers: joi.array().required(),
        answerKeys: joi.array().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        evaluator.title = data.title;
        evaluator.questionPapers = data.questionPaper;
        evaluator.answerKeys = data.answerKey;

        await evaluator.save();

        return res.send(evaluator);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

//EVALUATIONS
router.post("/evaluations/get", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId });

        if (!evaluation) {
            return res.send(null);
        }

        return res.send(evaluation);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluations/update", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        answerSheets: joi.array(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId });

        var answerSheetsData = [];

        for (var answerSheet of data.answerSheets) {
            if (answerSheet == null) {
                answerSheetsData.push(null);
            }
            else if (answerSheet.length <= 0) {
                answerSheetsData.push(null);
            }
            else {
                answerSheetsData.push(answerSheet);
            }
        }

        if (!evaluation) {
            const newEvaluation = new Evaluation({
                evaluatorId: data.evaluatorId,
                data: data.data,
                answerSheets: answerSheetsData,
            });

            await newEvaluation.save();

            return res.send(newEvaluation);
        }

        evaluation.answerSheets = answerSheetsData;
        await evaluation.save();

        return res.send(evaluation);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

export default router;