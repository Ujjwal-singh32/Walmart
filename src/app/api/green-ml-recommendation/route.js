import { NextResponse } from "next/server";

export async function POST(req) {
  const { query, page = 1 } = await req.json();

  try {
    const response = await fetch(`http://localhost:5000/search-green?query=${encodeURIComponent(query)}&page=${page}`);
    const data = await response.json();
   // console.log("data" , data);
    return NextResponse.json({ recommended: data });
  } catch (err) {
    console.error("Flask model error:", err);
    return NextResponse.json({ recommended: [], error: "Model failed" }, { status: 500 });
  }
}
