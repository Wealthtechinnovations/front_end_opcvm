import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    type: "GET REQUEST",
    data: { username: "@choubari_", url: "choubari.com" },
  });
}
export async function POST() {
  return NextResponse.json({
    type: "POST REQUEST",
    data: { username: "@choubari_", url: "choubari.com" },
  });
}
