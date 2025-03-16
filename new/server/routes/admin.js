import express from "express";
import { validateAdmin } from "../middlewares/validate.js";
import User from "../models/User.js";
import Limits from "../models/Limits.js";
import { hash } from "@uswriting/bcrypt";
import joi from "joi";
import Evaluator from "../models/Evaluator.js";
import Class from "../models/Class.js";
import { aiModels } from "../utils/models.js";
import { paymentGateways } from "../utils/payment.js";
import ShopItem from "../models/ShopItem.js";
import Settings from "../models/Settings.js";

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

router.get("/ai-models", validateAdmin, async (req, res) => {
    const settings = await Settings.findOne();

    aiModels.forEach((model) => {
        if (model.model === settings.aiModel) {
            model.selected = true;
        }
        else {
            model.selected = false;
        }
    });

    return res.send(aiModels);
});

router.post("/ai-models/select", validateAdmin, async (req, res) => {
    const schema = joi.object({
        model: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        await Settings.updateOne({}, { aiModel: data.model });
        return res.send(data);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/payment-gateways", validateAdmin, async (req, res) => {
    const settings = await Settings.findOne();

    paymentGateways.forEach((gateway) => {
        if (gateway.code === settings.paymentGateway) {
            gateway.selected = true;
        }
        else {
            gateway.selected = false;
        }
    });

    return res.send(paymentGateways);
});

router.post("/payment-gateways/select", validateAdmin, async (req, res) => {
    const schema = joi.object({
        gateway: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        await Settings.updateOne({}, { paymentGateway: data.gateway });
        return res.send(data);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/shop-items", validateAdmin, async (req, res) => {
    return res.send(await ShopItem.find());
});

router.post("/shop-items/new", validateAdmin, async (req, res) => {
    const schema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        evaluatorLimit: joi.number().required(),
        evaluationLimit: joi.number().required(),
        classesLimit: joi.number().required(),
        price: joi.number().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const newItem = new ShopItem(data);
        await newItem.save();
        return res.send(newItem);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/shop-items/edit", validateAdmin, async (req, res) => {
    const schema = joi.object({
        itemId: joi.string().required(),
        title: joi.string().required(),
        description: joi.string().required(),
        evaluatorLimit: joi.number().required(),
        evaluationLimit: joi.number().required(),
        classesLimit: joi.number().required(),
        price: joi.number().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const updatedItem = await ShopItem.findByIdAndUpdate(data.itemId, {
            title: data.title,
            description: data.description,
            evaluatorLimit: data.evaluatorLimit,
            evaluationLimit: data.evaluationLimit,
            classesLimit: data.classesLimit,
            price: data.price
        }, { new: true });

        return res.send(updatedItem);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/shop-items/delete", validateAdmin, async (req, res) => {
    const schema = joi.object({
        itemId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        return res.send(await ShopItem.findByIdAndDelete(data.itemId));
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

export default router;