const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    username: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    bio: {
      type: String,
    },
    clinicName: {
      type: String,
    },
    clinicAddress: {
      type: String,
    },
    clinicImages: [
      {
        type: String,
      },
    ],
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pincode: {
      type: String,
    },
    price: {
      type: Number,
    },
    services: [
      {
        type: String,
      },
    ],
    specialization: [
      {
        type: String,
      },
    ],
    education: [
      {
        degree: {
          type: String,
        },
        college: {
          type: String,
        },
        year: {
          type: String,
        },
      },
    ],
    experience: [
      {
        hospital: {
          type: String,
        },
        from: {
          type: Date,
        },
        to: {
          type: Date,
        },
        designation: {
          type: String,
        },
      },
    ],
    profilePic:{
      type: String,
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
