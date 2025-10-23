import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ["user"] },
  favorites: { type: [Schema.Types.ObjectId], ref: "Seed", default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default model("User", userSchema);