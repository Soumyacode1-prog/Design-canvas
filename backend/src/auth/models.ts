import mongoose, { Schema } from "mongoose";

export const User = mongoose.model("User", new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true }));

export const Session = mongoose.model("Session", new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  accessHash: { type: String, required: true, unique: true },
  accessExpiresAt: { type: Date, required: true },
  refreshHash: { type: String, required: true, unique: true },
  usedRefreshHashes: { type: [String], default: [] },
  expiresAt: { type: Date, required: true, expires: 0 },
  revoked: { type: Boolean, default: false },
}, { timestamps: true }));

export const AuthAttempt = mongoose.model("AuthAttempt", new Schema({
  _id: String,
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, expires: 0 },
}));
