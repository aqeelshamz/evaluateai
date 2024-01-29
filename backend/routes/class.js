import joi from "joi";
import express from "express";
import Class from "../models/Class.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", validate, async (req, res) => {
    return res.send(await Class.find({ createdBy: req.user._id }));
});

router.post("/create", validate, async (req, res) => {
    const schema = joi.object({
        name: joi.string().required(),
        section: joi.string().required(),
        subject: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const newClass = new Class({
            name: data.name,
            section: data.section,
            subject: data.subject,
            students: [],
            createdBy: req.user._id,
        });

        await newClass.save();

        return res.send(newClass);
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

router.post("/delete", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const _class = await Class.findById(data.classId);

        if (_class.createdBy.toString() != req.user._id.toString()) {
            return res.status(400).send("You are not authorized to delete this class");
        }

        await Class.findByIdAndDelete(data.classId);

        return res.send("Class deleted successfully");
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

router.post("/update", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
        name: joi.string().required(),
        section: joi.string().required(),
        subject: joi.string().required(),
        students: joi.array().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const _class = await Class.findById(data.classId);

        if (_class.createdB.toString() != req.user._id.toString()) {
            return res.status(400).send("You are not authorized to update this class");
        }

        _class.name = data.name;
        _class.section = data.section;
        _class.subject = data.subject;
        _class.students = data.students;

        await _class.save();

        return res.send(_class);
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

export default router;