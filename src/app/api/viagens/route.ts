// app/api/viagens/route.ts
import {
  createViagem,
  getAllViagens,
} from "@/lib/controllers/viagemController";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getAllViagens();
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newViagem = await createViagem(data);
    return NextResponse.json({ success: true, data: newViagem });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}