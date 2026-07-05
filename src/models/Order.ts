import mongoose, { Schema, models } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    tierId: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
    mpesaReceiptNumber: { type: String }, // For future M-Pesa integration
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model('Order', orderSchema);
export default Order;
