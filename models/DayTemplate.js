import mongoose from "mongoose";

const dayTemplateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // "Weekday routine", "Weekend plan"
    description: { type: String },
    blocks: [{
      title: { type: String, required: true },
      category: {
        type: String,
        enum: ['study','exercise','meal','routine','break','personal'],
        default: 'study'
      },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      notes: { type: String },
    }],
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.DayTemplate || mongoose.model("DayTemplate", dayTemplateSchema);
