import joi from "joi";
import express from "express";
import { validate } from "../middlewares/validate.js";
import Evaluator from "../models/Evaluator.js";
import Limits from "../models/Limits.js";

const router = express.Router();

//EVALUATORS
router.get("/evaluators", validate, async (req, res) => {
    const evaluators = await Evaluator.find({ userId: req.user._id });
    return res.send({ evaluators: evaluators, user: { name: req.user.name, email: req.user.email, type: req.user.type } });
});

router.post("/evaluators/create", validate, async (req, res) => {
    const schema = joi.object({
        title: joi.string().required(),
        questionPaper: joi.array().required(),
        answerKey: joi.array().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const limits = await Limits.findOne({ userId: req.user._id });

        if (limits.evaluatorLimit <= 0) {
            return res.status(400).send("Evaluator limit exceeded");
        }

        limits.evaluatorLimit -= 1;

        await limits.save();

        const evaluator = new Evaluator({
            userId: req.user._id,
            title: data.title,
            questionPaper: data.questionPaper,
            answerKey: data.answerKey,
        });

        await evaluator.save();

        return res.send(evaluator);
    }
    catch (err) {
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

        await evaluator.delete();

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
        questionPaper: joi.array().required(),
        answerKey: joi.array().required(),
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
        evaluator.questionPaper = data.questionPaper;
        evaluator.answerKey = data.answerKey;

        await evaluator.save();

        return res.send(evaluator);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

//EVALUATIONS

export default router;