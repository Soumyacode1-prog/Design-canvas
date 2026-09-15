import mongoose, { Schema } from "mongoose";
export declare const User: mongoose.Model<{
    name: string;
    email: string;
    passwordHash: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    passwordHash: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    passwordHash: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    passwordHash: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    passwordHash: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    passwordHash: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    passwordHash: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    passwordHash: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const Session: mongoose.Model<{
    user: mongoose.Types.ObjectId;
    accessHash: string;
    accessExpiresAt: NativeDate;
    refreshHash: string;
    usedRefreshHashes: string[];
    expiresAt: NativeDate;
    revoked: boolean;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    accessHash: string;
    accessExpiresAt: NativeDate;
    refreshHash: string;
    usedRefreshHashes: string[];
    expiresAt: NativeDate;
    revoked: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    accessHash: string;
    accessExpiresAt: NativeDate;
    refreshHash: string;
    usedRefreshHashes: string[];
    expiresAt: NativeDate;
    revoked: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    user: mongoose.Types.ObjectId;
    accessHash: string;
    accessExpiresAt: NativeDate;
    refreshHash: string;
    usedRefreshHashes: string[];
    expiresAt: NativeDate;
    revoked: boolean;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    accessHash: string;
    accessExpiresAt: NativeDate;
    refreshHash: string;
    usedRefreshHashes: string[];
    expiresAt: NativeDate;
    revoked: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    accessHash: string;
    accessExpiresAt: NativeDate;
    refreshHash: string;
    usedRefreshHashes: string[];
    expiresAt: NativeDate;
    revoked: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    user: mongoose.Types.ObjectId;
    accessHash: string;
    accessExpiresAt: NativeDate;
    refreshHash: string;
    usedRefreshHashes: string[];
    expiresAt: NativeDate;
    revoked: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    user: mongoose.Types.ObjectId;
    accessHash: string;
    accessExpiresAt: NativeDate;
    refreshHash: string;
    usedRefreshHashes: string[];
    expiresAt: NativeDate;
    revoked: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const AuthAttempt: mongoose.Model<{
    _id?: string | null;
    count: number;
    expiresAt?: NativeDate | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    _id?: string | null;
    count: number;
    expiresAt?: NativeDate | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    _id?: string | null;
    count: number;
    expiresAt?: NativeDate | null;
} & Required<{
    _id: string | null;
}> & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    _id?: string | null;
    count: number;
    expiresAt?: NativeDate | null;
}, mongoose.Document<unknown, {}, {
    _id?: string | null;
    count: number;
    expiresAt?: NativeDate | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    _id?: string | null;
    count: number;
    expiresAt?: NativeDate | null;
} & Required<{
    _id: string | null;
}> & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    _id?: string | null;
    count: number;
    expiresAt?: NativeDate | null;
} & Required<{
    _id: string | null;
}> & {
    __v: number;
}>, {
    _id?: string | null;
    count: number;
    expiresAt?: NativeDate | null;
} & Required<{
    _id: string | null;
}> & {
    __v: number;
}>;
//# sourceMappingURL=models.d.ts.map