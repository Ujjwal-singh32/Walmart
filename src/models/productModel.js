import mongoose from 'mongoose';

const VarietySchema = new mongoose.Schema({
  name: String,           
  price: Number,          
  stock: Number,          
  unit: String            
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true }, 
  name: { type: String, required: true },
  description: { type: String, required: true },
  isOrganic: { type: Boolean, default: false },
  tags: [String],             
  images: [String],            
  variety: [VarietySchema],    
  details: [
  {
    title: { type: String, required: true },
    value: { type: String, required: true }
  }
],
          // array of strings for extra info
  basePrice: { type: Number, required: true }, // used if no variety is selected

  // Sustainability Info
  sustainableScore: { type: Number, default: 0 },    // score out of 100
  energyUsed: { type: Number, default: 0 },          // in kWh or MJ
  emissions: { type: Number, default: 0 },           // in kg CO2
  greenPoints: { type: Number, default: 0 },         // points awarded on purchase
  waterSaved: { type: Number, default: 0 },          // in liters
  plasticAvoided: { type: Number, default: 0 },      // in kg or grams

  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;

