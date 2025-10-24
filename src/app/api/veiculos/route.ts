// app/api/veiculos/route.ts
import {
  createVeiculo,
  getAllVeiculos,
} from "@/lib/controllers/veiculoController";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getAllVeiculos();
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar veículos:", error.message);
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({ success: false, error: "Ocorreu um erro desconhecido ao buscar veículos." });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newVeiculo = await createVeiculo(data);
    return NextResponse.json({ success: true, data: newVeiculo });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao criar veículo:", error.message);
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({ success: false, error: "Ocorreu um erro desconhecido ao criar veículo." });
  }
}