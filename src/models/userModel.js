import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Basic Info
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,

  address: [
    {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    }
  ],

  // Account Details
  isPrimeMember: { type: Boolean, default: false },
  memberSince: { type: Date, default: Date.now },
  ordersPlaced: { type: Number, default: 0 },
  walletPoints: { type: Number, default: 0 },
  // Badges and Trust
  isTrustedReviewer: { type: Boolean, default: false },
  ecoPackages: { type: Number, default: 0 }, 

  // GreenKart Monthly Sustainability Metrics
  greenStats: {
    monthlyCarbonData: [
      {
        month: String,
        value: Number  // Carbon saved (kg)
      }
    ],
    monthlyPointsData: [
      {
        month: String,
        value: Number  // Points earned
      }
    ],
    monthlyEmissionsData: [
      {
        month: String,
        value: Number  // Emissions avoided (kg CO2)
      }
    ],
    monthlyPlasticsData: [
      {
        month: String,
        value: Number  // Plastics avoided (kg)
      }
    ],
    monthlyWaterData: [
      {
        month: String,
        value: Number  // Water saved (liters)
      }
    ],
    monthlyGroupedOrdersData: [
      {
        month: String,
        value: Number  // Grouped orders count
      }
    ]
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
