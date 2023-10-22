const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const scheduleSchema = mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  slots: [
    {
      day: {
        type: String,
        required: true,
      },
      daySlots: [
        {
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
          isBooked: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
});

scheduleSchema.plugin(mongoose_delete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
