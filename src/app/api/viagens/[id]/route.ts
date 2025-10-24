import {
  deleteViagem,
  getOneViagem,
  updateViagem,
} from "@/lib/controllers/viagemController";
import { NextRequest, NextResponse } from "next/server";

interface Parametro {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Parametro }
) {
  try {
    const { id } = params;
    const data = await req.json();
    const viagemAtualizada = await updateViagem(id, data);
    if (!viagemAtualizada) {
      return NextResponse.json({ success: false, error: "Not Found" });
    }
    return NextResponse.json({ success: true, data: viagemAtualizada });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Parametro }
) {
  try {
    const { id } = params;
    const data = await getOneViagem(id);
    if (!data) {
      return NextResponse.json({ success: false, error: "Not Found" });
    }
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Parametro }
) {
  try {
    const { id } = params;
    await deleteViagem(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}