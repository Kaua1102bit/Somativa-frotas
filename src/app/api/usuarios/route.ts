import {
  createUsuario,
  getAllUsuarios,
} from "@/lib/controllers/usuarioController";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    const data = await getAllUsuarios();
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar usuários:", error.message);
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({ success: false, error: "Ocorreu um erro desconhecido ao buscar usuários." });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newUsuario = await createUsuario(data);
    return NextResponse.json({ success: true, data: newUsuario });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao criar usuário:", error.message);
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({ success: false, error: "Ocorreu um erro desconhecido." });
  }
}