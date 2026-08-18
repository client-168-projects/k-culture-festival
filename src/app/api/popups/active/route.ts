import { NextResponse } from "next/server";

import { getActiveNoticePopups } from "@/lib/notice-popups";

export async function GET() {
  const popups = await getActiveNoticePopups();
  return NextResponse.json({ popups });
}
