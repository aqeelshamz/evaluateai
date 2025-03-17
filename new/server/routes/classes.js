import express from "express";
import { validate } from "../middlewares/validate.js";
import Limits from "../models/Limits.js";
import Class from "../models/Class.js";
import joi from "joi";

const router = express.Router();

router.get("/", validate, async (req, res) => {
    const limits = await Limits.findOne({ userId: req.user._id });

    const classes = await Class.find({ userId: req.user._id }).lean();
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

router.post("/delete", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        await Class.findOneAndDelete({ _id: data.classId, userId: req.user._id });
        return res.send("Deleted");
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/add-student", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
        name: joi.string().required(),
        email: joi.string().email().required(),
        rollNo: joi.number().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const classData = await Class.findOne({ _id: data.classId, userId: req.user._id }).lean();

        if (!classData) return res.status(400).send("Invalid Class");

        const student = {
            name: data.name,
            email: data.email,
            rollNo: data.rollNo,
        };

        classData.students.push(student);

        await Class.updateOne({ _id: data.classId, userId: req.user._id }, { students: classData.students });
        return res.send(classData.students);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/edit-student", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
        name: joi.string().required(),
        email: joi.string().email().required(),
        rollNo: joi.number().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const classData = await Class.findOne({ _id: data.classId, userId: req.user._id }).lean();

        if (!classData) return res.status(400).send("Invalid Class");

        const student = {
            name: data.name,
            email: data.email,
            rollNo: data.rollNo,
        };

        const studentIndex = classData.students.findIndex((student) => student.rollNo === data.rollNo);
        classData.students[studentIndex] = student;

        await Class.updateOne({ _id: data.classId, userId: req.user._id }, { students: classData.students });

        return res.send(classData.students);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/delete-student", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
        rollNo: joi.number().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const classData = await Class.findOne({ _id: data.classId, userId: req.user._id }).lean();

        if (!classData) return res.status(400).send("Invalid Class");

        const studentIndex = classData.students.findIndex((student) => student.rollNo === data.rollNo);
        classData.students.splice(studentIndex, 1);

        await Class.updateOne({ _id: data.classId, userId: req.user._id }, { students: classData.students });

        return res.send(classData.students);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/import-students", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
        students: joi.array().items(joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            rollNo: joi.number().required(),
        })).required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const classData = await Class.findOne({ _id: data.classId, userId: req.user._id }).lean();
        if (!classData) return res.status(400).send("Invalid Class");

        const studentMap = new Map(classData.students.map(student => [student.rollNo, student]));

        data.students.forEach((newStudent) => {
            studentMap.set(newStudent.rollNo, newStudent);
        });

        const updatedStudents = Array.from(studentMap.values());
        await Class.updateOne({ _id: data.classId, userId: req.user._id }, { students: updatedStudents });

        return res.send(updatedStudents);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});


export default router;