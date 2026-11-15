import mongoose from "mongoose";
import { getOrCreateModel } from "@/lib/db/modelHelper";

  const userSchema = new mongoose.Schema(
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      imageUrl: { type: String, required: true },
      cartItems: { type: Object, default: {} },
},
  { minimize: false }
);

const User = getOrCreateModel("User", userSchema);

export default User;
