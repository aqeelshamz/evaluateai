import mongoose from "mongoose";

const ShopItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        type: {
            type: Number,
            enum: [0, 1], // 0: evaluator, 1: evaluation
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ShopItem = mongoose.model("ShopItem", ShopItemSchema);

export default ShopItem;