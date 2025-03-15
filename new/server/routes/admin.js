import express from "express";
import { validateAdmin } from "../middlewares/validate.js";
import User from "../models/User.js";
import Limits from "../models/Limits.js";
import { hash } from "@uswriting/bcrypt";
import joi from "joi";
import Evaluator from "../models/Evaluator.js";
import Class from "../models/Class.js";

const router = express.Router();

router.get("/users", validateAdmin, async (req, res) => {
    const users = await User.find().select("-password").lean();

    for (const user of users) {
        const limits = await Limits.findOne({ userId: user._id }).lean();
        const evaluatorUsage = await Evaluator.find({ userId: user._id }).countDocuments();
        const classesUsage = await Class.find({ userId: user._id }).countDocuments();
        user.limits = limits;
        user.limits.evaluatorUsage = evaluatorUsage;
        user.limits.classesUsage = classesUsage;
    }

    return res.send(users);
});

router.post("/users/update", validateAdmin, async (req, res) => {
    const schema = joi.object({
        userId: joi.string().required(),
        type: joi.number().required(),
        email: joi.string().required().email(),
        name: joi.string().required(),
        password: joi.string().allow(""),
        evaluatorLimit: joi.number().required(),
        evaluationLimit: joi.number().required(),
        classesLimit: joi.number().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        await User.updateOne({ _id: data.userId }, {
            type: data.type,
            email: data.email,
            name: data.name,
        });
        
        if (data.password) {
            const hashedPassword = hash(data.password, 10);
            await User.updateOne({ _id: data.userId }, { password: hashedPassword });
        }

        return res.send(data);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

export default router;