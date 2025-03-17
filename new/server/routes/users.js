import joi from "joi";
import { hash, compare } from "@uswriting/bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { appName, defaultClassesLimit, defaultEvaluationLimit, defaultEvaluatorLimit, logoBase64, skipEmailVerification } from "../utils/config.js";
import dotenv from "dotenv";
import EmailVerification from "../models/EmailVerification.js";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import Limits from "../models/Limits.js";
import { validate } from "../middlewares/validate.js";
import Settings from "../models/Settings.js";
import { defaultAIModel } from "../utils/models.js";
import { defaultPaymentGateway } from "../utils/payment.js";
import Evaluator from "../models/Evaluator.js";
import Class from "../models/Class.js";
import EvaluationUsage from "../models/EvaluationUsage.js";

dotenv.config();

const router = express.Router();

router.get("/", validate, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.get("/limits", validate, async (req, res) => {
    const limits = await Limits.findOne({ userId: req.user._id }).lean();

    const evaluators = await Evaluator.find({ userId: req.user._id }).countDocuments();
    const classes = await Class.find({ userId: req.user._id }).countDocuments();
    const evaluations = await EvaluationUsage.find({ userId: req.user._id }).countDocuments();

    limits.evaluatorUsage = evaluators;
    limits.classesUsage = classes;
    limits.evaluationUsage = evaluations;

    res.send(limits);
});

router.post("/login", async (req, res) => {
    const schema = joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const user = await User.findOne({ email: data.email });

        if (!user) return res.status(400).send("Email or password is wrong");

        const validPassword = compare(data.password, user.password);

        if (!validPassword)
            return res.status(400).send("Email or password is wrong");

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        return res.send({ user: user, token: token });
    } catch (err) {
        return res.status(500).send(err);
    }
});

async function sendEmail(email, res) {
    const transporter = nodemailer.createTransport(
        smtpTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            requireTLS: true,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
    );

    var minm = 1000;
    var maxm = 9999;
    const code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    const logoHTML = `<img width="200px" src='cid:logo'/>`;

    const options = {
        from: `${appName} <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Verify your email address`,
        attachments: [
            {
                filename: `${appName}.png`,
                path: logoBase64, //base64 image of logo
                cid: "logo",
            },
        ],
        html: `<div style="height:100%;background:black;color:white;padding:40px;"><center>${logoHTML}<br/><h2>Verify your email</h2></center><br/><p style="font-size:18px;">${appName} verification code: <b>${code.toString()}</b></p><br/><br/></div>`,
    };

    transporter.sendMail(options, async (err, info) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        console.log("Email sent: " + info.response);

        const emailVerification = await EmailVerification.findOne({
            email: email,
        });
        if (emailVerification) {
            await EmailVerification.findOneAndUpdate(
                { email: email },
                { code: code.toString() }
            );
        } else {
            const newEmailVerification = new EmailVerification({
                email: email,
                code: code.toString(),
                isVerified: false,
            });

            await newEmailVerification.save();
        }

        return res.send("Email sent!");
    });
}

router.post("/send-verification-code", async (req, res) => {
    const schema = joi.object({
        email: joi.string().email().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const emailVerification = await EmailVerification.findOne({
            email: data.email,
        });
        if (emailVerification && emailVerification.isVerified)
            return res.status(400).send("Email already verified");

        if (skipEmailVerification) {
            var minm = 1000;
            var maxm = 9999;
            const code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

            const emailVerification = await EmailVerification.findOne({
                email: data.email,
            });
            if (emailVerification) {
                await EmailVerification.findOneAndUpdate(
                    { email: data.email },
                    { code: code.toString() }
                );
            } else {
                const newEmailVerification = new EmailVerification({
                    email: data.email,
                    code: code.toString(),
                    isVerified: false,
                });

                await newEmailVerification.save();
            }

            return res.send({ skip: code.toString() });
        }

        await sendEmail(data.email, res, false);
    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

router.post("/verify-email-signup", async (req, res) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        code: joi.string().required(),
        name: joi.string().min(3).required(),
        password: joi.string().min(6).required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const emailVerification = await EmailVerification.findOne({
            email: data.email,
        });

        if (!emailVerification) return res.status(404).send("Email not found");

        if (emailVerification.code === data.code || skipEmailVerification) {
            await EmailVerification.updateOne(
                { email: data.email },
                { isVerified: true }
            );

            if (await User.findOne({ email: data.email }))
                return res.status(400).send("Email already exists");

            const hashedPassword = hash(data.password, 10);

            const users = await User.find();

            if (users.length === 0) {
                const settings = new Settings({
                    aiModel: defaultAIModel,
                    paymentGateway: defaultPaymentGateway,
                });

                await settings.save();
            }

            const newUser = new User({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                type: users.length == 0 ? 0 : 1,
            });

            const savedUser = await newUser.save();

            const newLimits = new Limits({
                userId: savedUser._id,
                evaluatorLimit: defaultEvaluatorLimit,
                evaluationLimit: defaultEvaluationLimit,
                classesLimit: defaultClassesLimit,
            });

            await newLimits.save();

            return res.send(savedUser);
        } else {
            return res.status(400).send("Invalid code");
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

export default router;