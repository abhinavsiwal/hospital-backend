const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const appointmentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
    },
    agenda: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.plugin(mongoose_delete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
