import express from "express";
import { validate } from "../middlewares/validate.js";
import Limits from "../models/Limits.js";
import Class from "../models/Class.js";
import joi from "joi";

const router = express.Router();

router.get("/", validate, async (req, res) => {
    const limits = await Limits.findOne({ userId: req.user._id });

    const classes = await Class.find();
    return res.send({ classes, limit: limits.classesLimit });
});

router.post("/by-id", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const classData = await Class.findOne({ _id: data.classId, userId: req.user._id });
        return res.send(classData);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/new", validate, async (req, res) => {
    const schema = joi.object({
        name: joi.string().required(),
        section: joi.string().required(),
        subject: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const classes = await Class.find({ userId: req.user._id });

        const limits = await Limits.findOne({ userId: req.user._id });

        if (classes.length >= limits.classesLimit) {
            return res.status(400).send("You have reached the limit of classes you can create. Please upgrade your plan to create more classes.");
        }

        const newClass = new Class({
            userId: req.user._id,
            name: data.name,
            section: data.section,
            subject: data.subject,
            students: [],
        });

        await newClass.save();
        return res.send(newClass);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/save", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
        name: joi.string().required(),
        section: joi.string().required(),
        subject: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const classData = await Class.findOneAndUpdate({ _id: data.classId, userId: req.user._id }, {
            name: data.name,
            section: data.section,
            subject: data.subject,
        }, { new: true });
        
        return res.send(classData);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

export default router;