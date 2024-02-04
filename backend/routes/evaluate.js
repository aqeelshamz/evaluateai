import joi from "joi";
import express from "express";
import { validate } from "../middlewares/validate.js";
import Evaluator from "../models/Evaluator.js";
import Limits from "../models/Limits.js";
import Evaluation from "../models/Evaluation.js";
import Class from "../models/Class.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import { aiPrompt } from "../utils/utils.js";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

router.post("/evaluators/evaluate", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        rollNo: joi.number().required(),
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
            return res.status(400).send("Evaluation not found");
        }

        const answerSheets = evaluation.answerSheets[data.rollNo - 1];

        if (!answerSheets) {
            return res.send(null);
        }

        const classData = await Class.findById(evaluator.classId);

        var questionPapersPrompt = [];
        var answerKeysPrompt = [];
        var answerSheetsPrompt = [];

        questionPapersPrompt.push({ type: "text", text: "Question Paper(s):" });
        for (const questionPaper of evaluator.questionPapers) {
            questionPapersPrompt.push({ type: "image_url", image_url: questionPaper });
        }

        answerKeysPrompt.push({ type: "text", text: "Answer Key(s):" });
        for (const answerKey of evaluator.answerKeys) {
            answerKeysPrompt.push({ type: "image_url", image_url: answerKey });
        }

        answerSheetsPrompt.push({ type: "text", text: "Answer Sheet(s):" });
        for (const answerSheet of answerSheets) {
            answerSheetsPrompt.push({ type: "image_url", image_url: answerSheet });
        }

        var messages = [
            {
                role: "system",
                content: aiPrompt,
            },
            {
                role: "user",
                content: questionPapersPrompt,
            },
            {
                role: "user",
                content: answerKeysPrompt,
            },
            {
                role: "user",
                content: "student_name: " + classData.students[data.rollNo - 1].name,
            },
            {
                role: "user",
                content: "roll_no: " + classData.students[data.rollNo - 1].rollNo,
            },
            {
                role: "user",
                content: "class: " + classData.name + " " + classData.section,
            },
            {
                role: "user",
                content: "subject: " + classData.subject,
            },
            {
                role: "user",
                content: answerSheetsPrompt,
            },
        ];

        console.log(messages);

        const completion = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: messages,
            max_tokens: 1000,
        });

        console.log("RESPONSE:");

        console.log(completion.choices[0].message.content);

        const resp = completion.choices[0].message.content;

        const respData = JSON.parse(resp.split("```json")[1].split("```")[0]);

        console.log("RESPONSE DATA:");
        console.log(respData);

        await Evaluation.updateOne({ evaluatorId: data.evaluatorId }, { $set: { ["data." + (data.rollNo)]: respData } });

        return res.send(respData);
    }
    catch (err) {
        console.log(err);
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