import { searchOpportunitiesByVector } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const opportunities = await searchOpportunitiesByVector({ query });
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error searching opportunities:', error);
    return NextResponse.json({ error: 'Failed to search opportunities' }, { status: 500 });
  }
} 