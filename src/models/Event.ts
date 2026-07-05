import mongoose, { Schema, models } from 'mongoose';

const ticketTierSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  capacity: { type: Number, default: 100 },
});

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    tiers: [ticketTierSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Event = models.Event || mongoose.model('Event', eventSchema);
export default Event;
