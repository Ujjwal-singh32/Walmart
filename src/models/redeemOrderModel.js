import mongoose from 'mongoose';

const RedeemOrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  product: {
    name: String,
    image: String,
    greenPoints: Number,
  },
  status: { type: String, default: "Pending" },
  redeemedAt: { type: Date, default: Date.now },
});

export default mongoose.models.RedeemOrder || mongoose.model("RedeemOrder", RedeemOrderSchema);
