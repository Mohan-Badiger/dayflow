import mongoose from "mongoose"

const TemplateBlockSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true, maxlength: 200 },
  category: {
    type: String,
    enum: ["study","exercise","meal","routine","break","personal"],
    default: "study"
  },
  startTime: { type: String, required: true },
  endTime:   { type: String, required: true },
  notes:     { type: String, maxlength: 300 },
}, { _id: true })

const DayTemplateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name:        { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 300 },
  blocks:      { type: [TemplateBlockSchema], default: [] },
  isDefault:   { type: Boolean, default: false },
  usageCount:  { type: Number, default: 0 },
}, {
  timestamps: true,
})

DayTemplateSchema.index({ userId: 1 })

export default mongoose.models.DayTemplate ||
  mongoose.model("DayTemplate", DayTemplateSchema)
