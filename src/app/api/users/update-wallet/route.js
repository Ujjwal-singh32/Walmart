import dbConnect from "@/lib/db"; // your DB connection util
import User from "@/models/userModel"; // your user model

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, deductPoints } = req.body;

  if (!userId || typeof deductPoints !== "number") {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ clerkId: userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.walletPoints = Math.max(0, user.walletPoints - deductPoints);

    await user.save();

    return res.status(200).json({ message: "Wallet updated", newPoints: user.walletPoints });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
