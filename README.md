# ♻️ Theme: Sustainable Shopping Experience

**Amazon HackOn-S5 | Team CLUE CREW — NIT Jamshedpur**

---

## 1. 🖼️ Demo

Deployed Link : https://amazon-app-gules.vercel.app/home

Please refer to the attached PDF for a detailed demonstration of the prototype in action.

**[📄 View the Working Prototype Demo (PDF) on Google Drive](https://drive.google.com/file/d/1VQgCOtPETcsS1JYC76N428RzUEkishtN/view?usp=sharing)**

---

## 2. 🚩 Problem Statement
Eco-conscious shoppers face real barriers:
- Scattered sustainable options across platforms
- Lack of trust due to greenwashing and unclear certifications
- Wasteful, fragmented deliveries
- No control over packaging choices

---

## 3. 💡 Solution Overview
We developed a one-stop, AI-powered platform for sustainable shopping. where in we:
- Centralized verified eco-friendly products
- Offered transparent eco-grading and impact stats
- Enabled group buying and eco-packaging selection
- Gamified green choices with rewards and dashboards

---

## 4. 🌟 Key Features
### AI-Driven Discovery
- Smart search and filter for green/organic products
- Eco-scores and badges for verified sustainable products

### Green Store
- Dedicated GreenKart section for only organic/eco-friendly products
- Each product displays sustainability metrics: carbon saved, water saved, plastic avoided, sustainability score
- Dynamic badges and eco-grades (A–E) on product cards

### Smart Cart & Eco-Checkout
- Choose between Minimalist, Compostable, or Reusable packaging at checkout
- Group order option to consolidate deliveries and reduce emissions
- Real-time calculation of carbon savings and green points

### Impact Dashboard
- User dashboard with visual data for:
  - Carbon saved
  - Water saved
  - Plastic avoided
  - Green points earned
- Monthly and cumulative stats

### Rewards & Gamification
- Earn green points for every sustainable action (eco-purchase, group order, eco-packaging)
- Redeem points for eco-friendly rewards (e.g., bamboo cutlery, solar power bank)

### Admin/Product Management
- Add new products with detailed sustainability metrics and images
- Dynamic product variety, pricing, and stock management
- Shipment handling for group buy

---

## 5. 🛒 User Journey Walkthrough
1. **Discover:**
   - AI suggests eco-products based on the user's search
   - Browse GreenKart for verified sustainable options
2. **Shop:**
   - Add products to cart
   - Choose packaging (Minimalist, Compostable, Reusable)
   - Option to join group orders for carbon savings
3. **Checkout:**
   - See real-time impact stats (carbon, water, plastic, green points)
   - Select payment method (Razorpay, COD)
4. **Track:**
   - View order history and status
   - Access personal impact dashboard
5. **Engage:**
   - Redeem green points for rewards
   - Invite friends and build local eco-communities

---

## 6. 📊 Impact & Metrics (Futuristic)
- 🚚 45% less CO₂ in last-mile delivery (group buying)
- ♻ 2kg plastic saved per user/month (eco-packaging)
- 📈 2.5x more eco-decisions (impact tracking & rewards)
- 🤝 Green communities formed, not just transactions

---

## 7. 🏗️ Tech Stack & Architecture
- **Frontend:** Next.js 15, React 19, Tailwind CSS, Recharts
- **Backend:** Next.js API Routes, Node.js, MongoDB
- **Auth:** Clerk
- **Payments:** Razorpay
- **Media:** Cloudinary

### Folder Structure
```
public/         # Images & static assets
src/
  app/          # Next.js app directory (pages, routes)
  components/   # Reusable UI components (Navbar, ProductCard, etc.)
  context/      # React Context providers (cart, products)
  lib/          # Utility libraries (DB, helpers)
  models/       # Mongoose models (User, Product, Order)
  assets/       # App-specific images/icons
```

### Data Models
- **User:**
  - Basic info, address, prime status, trust badges
  - Sustainability stats: carbon, water, plastic, points (monthly & total)
- **Product:**
  - Name, description, tags, images, varieties, price
  - Sustainability metrics: sustainableScore, energyUsed, emissions, greenPoints, waterSaved, plasticAvoided
- **Order:**
  - User, items, total, payment & order status, shipping address, delivery option, packaging points, placedAt

---

## 8. 🚀 Towards Scalibility
- **Marketplace Expansion:** Electronics, fashion, home goods, and more
- **Smarter AI:** Multilingual, context-aware, always learning
- **Carbon Offsetting:** Real-time tracking and offset at checkout
- **Bigger Community:** More group features, social impact, and advocacy tools

---

## 9. 👥 Team Members
- Aditya Tiwari
- Rohit Ratnam
- Ujjwal Singh
- Aditya Kumar

---

## 10. 🌍 Join the Movement
Empowering users to shop smart, green, and together.  
Let’s make sustainability the easiest—and most rewarding—choice.

> _"Every green purchase plants a better future."_
