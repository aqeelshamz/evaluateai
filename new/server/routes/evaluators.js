import express from "express";
import joi from "joi";
import { validate } from "../middlewares/validate.js";
import Evaluator from "../models/Evaluator.js";
import Limits from "../models/Limits.js";
import OpenAI from "openai";
import Settings from "../models/Settings.js";
import { aiPrompt } from "../utils/ai.js";
import Evaluation from "../models/Evaluation.js";
import Class from "../models/Class.js";
import EvaluationUsage from "../models/EvaluationUsage.js";

const router = express.Router();

router.get("/", validate, async (req, res) => {
    const limits = await Limits.findOne({ userId: req.user._id });
    var hasOngoingEvaluations = false;

    const evaluators = await Evaluator.find({ userId: req.user._id }).populate("classId").lean();
    for (const evaluator of evaluators) {
        const evaluation = await Evaluation.findOne({ evaluatorId: evaluator._id, userId: req.user._id });
        if (!evaluation) {
            evaluator.evaluating = false;
            continue;
        }
        if (!evaluation?.isCompleted) {
            evaluator.evaluating = true;
            hasOngoingEvaluations = true;
        }
        else {
            evaluator.evaluating = false
        }
    }

    return res.send({ evaluators, limit: limits.evaluatorLimit, hasOngoingEvaluations });
});

router.post("/by-id", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const evaluator = await Evaluator.findOne({ _id: data.evaluatorId, userId: req.user._id }).select("-answerSheets._id").populate("classId");

        if (!evaluator) return res.status(400).send("Invalid Evaluator ID");

        return res.send(evaluator);
    }
    catch (err) {
        return res.status(500).send(err);
    }
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
            answerSheets: [],
            extraPrompt: "",
            totalMarks: 100,
        });

        await newEvaluator.save();
        return res.send(newEvaluator);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/save", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        title: joi.string().required(),
        description: joi.string().allow(""),
        classId: joi.string().required(),
        questionPapers: joi.array().items(joi.string()).required(),
        answerKeys: joi.array().items(joi.string()).required(),
        answerSheets: joi.array().items(joi.object({
            rollNo: joi.number().required(),
            answerSheets: joi.array().items(joi.string()).required(),
        })).required(),
        extraPrompt: joi.string().allow(""),
        totalMarks: joi.number().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findOne({ _id: data.evaluatorId, userId: req.user._id });

        if (!evaluator) return res.status(400).send("Invalid Evaluator ID");

        evaluator.title = data.title;
        evaluator.description = data.description;
        evaluator.classId = data.classId;
        evaluator.questionPapers = data.questionPapers;
        evaluator.answerKeys = data.answerKeys;
        evaluator.answerSheets = data.answerSheets;
        evaluator.extraPrompt = data.extraPrompt;
        evaluator.totalMarks = data.totalMarks;

        await evaluator.save();

        return res.send(evaluator);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/delete", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        await Evaluator.findOneAndDelete({ _id: data.evaluatorId, userId: req.user._id });
        return res.send("Deleted");
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

//Evaluate
const aiClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

const parseAIResponse = (aiContent) => {
    // Clean up escaped characters first
    const cleanedContent = aiContent.replace(/\\n/g, '\n').replace(/\\"/g, '"');

    const jsonMatch = cleanedContent.match(/```json\n([\s\S]*?)\n```/);

    if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
    } else {
        throw new Error('JSON content not found in AI response');
    }
};

const evaluateAnswerSheets = async (evaluator, rollNo, userId) => {
    try {
        console.log("Evaluating", rollNo);
        const studentSheet = evaluator.answerSheets.find(sheet => sheet.rollNo === rollNo);

        if (!studentSheet || studentSheet.answerSheets.length === 0) {
            await Evaluation.updateOne({ evaluatorId: evaluator._id, userId: userId }, {
                $set: {
                    [`evaluation.${rollNo}.isCompleted`]: true,
                },
            });
            console.log("Evaluation completed for", rollNo);
            return;
        }

        const settings = await Settings.findOne();
        const aiModel = settings.aiModel;

        await Evaluation.updateOne({ evaluatorId: evaluator._id, userId: userId }, {
            $set: {
                hasErrors: false,
                errorLog: "",
                aiResponse: "",
                isCompleted: false,
            },
        });

        const completion = await aiClient.chat.completions.create({
            model: aiModel,
            messages: [
                { role: "system", content: aiPrompt },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Question Paper:" },
                        ...evaluator.questionPapers.map(url => ({
                            type: "image_url",
                            image_url: { url },
                        })),
                        { type: "text", text: "Answer Keys / Answer Criteria:" },
                        ...evaluator.answerKeys.map(url => ({
                            type: "image_url",
                            image_url: { url },
                        })),
                        { type: "text", text: `Student Answer Sheets:` },
                        ...studentSheet.answerSheets.map(url => ({
                            type: "image_url",
                            image_url: { url },
                        })),
                        { type: "text", text: "Extra Instruction:" },
                        { type: "text", text: evaluator.extraPrompt || "Nothing" },
                        { type: "text", text: `Total Marks: ${evaluator.totalMarks}` },
                    ],
                },
            ],
        });

        var airesp = "";
        if (completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content) {
            airesp = completion.choices[0].message.content;
        } else if (completion.error && completion.error.message) {
            airesp = completion.error.message
        } else {
            airesp = "No valid response from AI";
        }

        await Evaluation.updateOne({ evaluatorId: evaluator._id, userId: userId }, {
            aiResponse: airesp
        });
        const aiMessageContent = completion.choices[0].message.content;
        const parsedJSON = parseAIResponse(aiMessageContent);

        await Evaluation.updateOne({ evaluatorId: evaluator._id, userId: userId }, {
            $set: {
                [`evaluation.${rollNo}.answers`]: parsedJSON.answers,
                [`evaluation.${rollNo}.totalMarksObtained`]: parsedJSON.totalMarksObtained,
                [`evaluation.${rollNo}.totalMaximumMarks`]: parsedJSON.totalMaximumMarks,
                [`evaluation.${rollNo}.overallFeedback`]: parsedJSON.overallFeedback,
                [`evaluation.${rollNo}.isCompleted`]: true,
                [`evaluation.${rollNo}.studentRollNo`]: rollNo,
            },
        });

        const newEvaluationUsage = new EvaluationUsage({
            userId: userId
        });

        await newEvaluationUsage.save();

        await Evaluation.updateOne({ evaluatorId: evaluator._id, userId: userId }, {
            aiResponse: "",
        });

        const evaluation
            = await Evaluation.findOne({ evaluatorId: evaluator._id, userId: userId });

        const isCompleted = Object.values(evaluation.evaluation).every(sheet => sheet.isCompleted);

        if (isCompleted) {
            await Evaluation.updateOne({ evaluatorId: evaluator._id, userId: userId }, {
                $set: {
                    isCompleted: true,
                    hasErrors: false,
                    errorLog: "",
                },
            });
        }

        return parsedJSON;
    }
    catch (err) {
        console.log(err);
        await Evaluation.updateOne({ evaluatorId: evaluator._id, userId: userId }, {
            $set: {
                hasErrors: true,
                errorLog: err.message,
                isCompleted: true,
            },
        });
    }
};

router.post("/evaluate-all", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findOne({ _id: data.evaluatorId, userId: req.user._id });

        if (!evaluator) return res.status(400).send("Invalid Evaluator ID");

        const limits = await Limits.findOne({ userId: req.user._id }).lean();
        const evaluationUsage = await EvaluationUsage.find({ userId: req.user._id }).countDocuments();
        const evaluationsLeft = limits.evaluationLimit - evaluationUsage;
        
        if(evaluationUsage >= limits.evaluationLimit) {
            return res.status(400).send("You have reached the limit of evaluations you can perform. Please upgrade your plan to evaluate more answer sheets.");
        }

        const classData = await Class.findById(evaluator.classId);
        const rollNos = classData.students.map(student => student.rollNo);

        if(evaluationsLeft < rollNos.length) {
            return res.status(400).send("You do not have enough evaluations left to evaluate all answer sheets. Please upgrade your plan to evaluate more answer sheets.");
        }

        if(evaluator.questionPapers.length === 0) {
            return res.status(400).send("No question papers to evaluate");
        }

        if(evaluator.answerKeys.length === 0) {
            return res.status(400).send("No answer keys to evaluate");
        }

        if(evaluator.answerSheets.length === 0) {
            return res.status(400).send("No answer sheets to evaluate");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId, userId: req.user._id });
        if (!evaluation) {
            const newEvaluation = new Evaluation({
                userId: req.user._id,
                evaluatorId: data.evaluatorId,
                evaluation: {},
                isCompleted: false,
            });

            await newEvaluation.save();
        }
        else {
            await Evaluation.updateOne({ evaluatorId: data.evaluatorId, userId: req.user._id }, {
                $set: {
                    isCompleted: false,
                },
            });
        }

        rollNos.forEach(async (rollNo) => {
            await Evaluation.updateOne({ evaluatorId: data.evaluatorId, userId: req.user._id }, {
                $set: {
                    [`evaluation.${rollNo}.answers`]: [],
                    [`evaluation.${rollNo}.totalMarksObtained`]: 0,
                    [`evaluation.${rollNo}.totalMaximumMarks`]: evaluator.totalMarks,
                    [`evaluation.${rollNo}.overallFeedback`]: "",
                    [`evaluation.${rollNo}.isCompleted`]: false,
                    [`evaluation.${rollNo}.studentRollNo`]: rollNo,
                },
            });
            evaluateAnswerSheets(evaluator, rollNo, req.user._id);
        });

        return res.send("Evaluation started");
    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

router.post("/poll-evaluation", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId, userId: req.user._id }).lean();

        if (!evaluation) return res.status(400).send("Invalid Evaluator ID");

        var totalEvaluations = 0;
        var completedEvaluations = 0;

        for (const rollNo in evaluation.evaluation) {
            totalEvaluations++;
            if (evaluation.evaluation[rollNo].isCompleted) {
                completedEvaluations++;
            }
        }

        evaluation.totalEvaluations = totalEvaluations;
        evaluation.completedEvaluations = completedEvaluations;

        return res.send(evaluation);
    } catch (err) {
        return res.status(500).send(err);
    }
});

export default router;