import mongoose from "mongoose";
import Viagem, { IViagem } from "../models/Viagem";
import connectMongo from "../services/mongodb";

// 🔹 Buscar todas as viagens
export const getAllViagens = async () => {
  await connectMongo();
  const viagens = await Viagem.find()
    .populate("idMotorista", "nome email")
    .populate("idVeiculo", "placa modelo");
  return viagens;
};

// 🔹 Buscar uma viagem específica pelo ID
export const getOneViagem = async (id: string) => {
  await connectMongo();
  const viagem = await Viagem.findById(id)
    .populate("idMotorista", "nome email")
    .populate("idVeiculo", "placa modelo");
  return viagem;
};

// 🔹 Criar nova viagem
export const createViagem = async (data: Partial<IViagem>) => {
  await connectMongo();


  const novaViagem = new Viagem(data);
  const novaViagemSalva = await novaViagem.save();

  return await Viagem.findById(novaViagemSalva._id)
    .populate("idMotorista", "nome email")
    .populate("idVeiculo", "placa modelo");
};

// 🔹 Atualizar viagem existente
export const updateViagem = async (id: string, data: Partial<IViagem>) => {
  await connectMongo();


  const viagemAtualizada = await Viagem.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate("idMotorista", "nome email")
    .populate("idVeiculo", "placa modelo");

  return viagemAtualizada;
};

// 🔹 Deletar viagem
export const deleteViagem = async (id: string) => {
  await connectMongo();
  await Viagem.findByIdAndDelete(id);
  return { success: true, message: "Viagem removida com sucesso." };
};
