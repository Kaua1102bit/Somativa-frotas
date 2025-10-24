import Veiculo, { IVeiculo } from "../models/Veiculo"; // Adjusted to relative path
import connectMongo from "../services/mongodb"; // Adjusted path to the correct relative location

export const getAllVeiculos = async () => {
  await connectMongo();
  const veiculos = await Veiculo.find([]);
  return veiculos;
};

export const getOneVeiculo = async (id: string) => {
  await connectMongo();
  const veiculo = await Veiculo.findById(id);
  return veiculo;
};

export const createVeiculo = async (data: Partial<IVeiculo>) => {
  await connectMongo();
  const novoVeiculo = new Veiculo(data); // Cria uma nova instância do modelo
  const novoVeiculoSalvo = await novoVeiculo.save(); // Salva e aguarda a conclusão
  return novoVeiculoSalvo; // Retorna o documento salvo
};

export const updateVeiculo = async (id: string, data: Partial<IVeiculo>) => {
  await connectMongo();
  const veiculoAtualizado = await Veiculo.findByIdAndUpdate(id, data, {
    new: true,
  });
  return veiculoAtualizado;
};

export const deleteVeiculo = async (id: string) => {
  await connectMongo();
  await Veiculo.findByIdAndDelete(id);
};