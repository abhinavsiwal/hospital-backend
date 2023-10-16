const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const userSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Doctor", "User"],
    },
    otp: {
      type: Number,
    },
    otpCreatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(mongoose_delete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("User", userSchema);
