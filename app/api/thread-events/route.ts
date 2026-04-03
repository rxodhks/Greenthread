import { NextResponse } from "next/server";
import { getThreadEvents } from "@/lib/threadEventStore";

export const runtime = "nodejs";

export async function GET() {
  const events = await getThreadEvents();
  return NextResponse.json({ events });
}
