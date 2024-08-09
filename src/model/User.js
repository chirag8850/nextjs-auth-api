import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name Feild is required"],
  },

  email: {
    type: String,
    required: [true, "Email Feild is required"],
  },

  password: {
    type: String,
    required: [true, "Password Feild is required"],
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
