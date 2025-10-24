import {
  deleteUsuario,
  getOneUsuario,
  updateUsuario,
} from "@/lib/controllers/usuarioController";
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
    const usuarioAtualizado = await updateUsuario(id, data);
    if (!usuarioAtualizado) {
      return NextResponse.json({ success: false, error: "Not Found" });
    }
    return NextResponse.json({ success: true, data: usuarioAtualizado });
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
    const data = await getOneUsuario(id);
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
    await deleteUsuario(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}