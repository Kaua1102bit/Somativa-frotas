import { autenticaUsuario } from "@/lib/controllers/usuarioController";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_KEY;

if (!JWT_SECRET) {
  throw new Error("JWT_KEY não está definida nas variáveis de ambiente!");
}

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();
    if (!email || !senha) {
      return NextResponse.json({
        success: false,
        error: "Email e Senha obrigatórios!",
      });
    }

    const usuario = await autenticaUsuario(email, senha);
    if (!usuario) {
      return NextResponse.json({
        success: false,
        error: "Email ou Senha inválido",
      });
    }

    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome, funcao: usuario.funcao },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      token,
      usuario: { id: usuario.id, nome: usuario.nome, funcao: usuario.funcao },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error,
    });
  }
}