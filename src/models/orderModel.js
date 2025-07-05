import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: String, // Clerk Id
  items: [
    {
      productId: { type: String, required: true },
      quantity: Number,
      priceAtPurchase: Number,
    },
  ],
  totalAmount: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'returned','COD'], default: 'pending' },
  orderStatus: { type: String, enum: ['placed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  deliveryOption: {
    type: String,
    enum: ['individual', 'group'],
    default: 'individual', 
  },
  packagingPoints: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0, // Optional: default to 0
  },
  embeddedMap: {
    type: String,
    default: "empty", // Optional: default to empty string
  },
  placedAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;