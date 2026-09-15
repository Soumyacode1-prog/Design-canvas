import mongoose, { Schema } from "mongoose";
const canvasElementSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["rectangle", "circle", "text"],
        required: true,
    },
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    radius: {
        type: Number,
    },
    rotation: {
        type: Number,
        default: 0,
    },
    fill: {
        type: String,
        default: "#000000",
    },
    text: {
        type: String,
    },
    fontSize: {
        type: Number,
    },
    zIndex: {
        type: Number,
        default: 0,
    },
}, {
    _id: false,
});
const canvasSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    width: {
        type: Number,
        required: true,
        min: 100,
    },
    height: {
        type: Number,
        required: true,
        min: 100,
    },
    elements: {
        type: [canvasElementSchema],
        default: [],
    },
}, {
    timestamps: true,
});
export const Canvas = mongoose.model("Canvas", canvasSchema);
//# sourceMappingURL=canvas.model.js.map