import mongoose, { Schema } from "mongoose";
export declare const Canvas: mongoose.Model<{
    owner: mongoose.Types.ObjectId;
    title: string;
    width: number;
    height: number;
    elements: mongoose.Types.DocumentArray<{
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, {}, {}> & {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    owner: mongoose.Types.ObjectId;
    title: string;
    width: number;
    height: number;
    elements: mongoose.Types.DocumentArray<{
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, {}, {}> & {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    owner: mongoose.Types.ObjectId;
    title: string;
    width: number;
    height: number;
    elements: mongoose.Types.DocumentArray<{
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, {}, {}> & {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    owner: mongoose.Types.ObjectId;
    title: string;
    width: number;
    height: number;
    elements: mongoose.Types.DocumentArray<{
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, {}, {}> & {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    owner: mongoose.Types.ObjectId;
    title: string;
    width: number;
    height: number;
    elements: mongoose.Types.DocumentArray<{
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, {}, {}> & {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    owner: mongoose.Types.ObjectId;
    title: string;
    width: number;
    height: number;
    elements: mongoose.Types.DocumentArray<{
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, {}, {}> & {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    owner: mongoose.Types.ObjectId;
    title: string;
    width: number;
    height: number;
    elements: mongoose.Types.DocumentArray<{
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, {}, {}> & {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    owner: mongoose.Types.ObjectId;
    title: string;
    width: number;
    height: number;
    elements: mongoose.Types.DocumentArray<{
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }, {}, {}> & {
        id: string;
        type: "circle" | "rectangle" | "text";
        x: number;
        y: number;
        width?: number | null;
        height?: number | null;
        radius?: number | null;
        rotation: number;
        fill: string;
        text?: string | null;
        fontSize?: number | null;
        zIndex: number;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=canvas.model.d.ts.map