import {
  deleteVeiculo,
  getOneVeiculo,
  updateVeiculo,
} from "@/lib/controllers/veiculoController";
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
    const veiculoAtualizado = await updateVeiculo(id, data);
    if (!veiculoAtualizado) {
      return NextResponse.json({ success: false, error: "Not Found" });
    }
    return NextResponse.json({ success: true, data: veiculoAtualizado });
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
    const data = await getOneVeiculo(id);
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
    await deleteVeiculo(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}