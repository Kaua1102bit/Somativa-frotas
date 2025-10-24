import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVeiculo extends Document {
  _id: string;
  placa: string;
  modelo: string;
  ano: number;
  kmAtual: number;
  kmUltimaManutencao: number;
}

const VeiculoSchema: Schema<IVeiculo> = new Schema({
  placa: { type: String, required: true, unique: true },
  modelo: { type: String, required: true },
  ano: { type: Number, required: true },
  kmAtual: { type: Number, required: true, default: 0 },
  kmUltimaManutencao: { type: Number, required: false, default: 0 },
});

const Veiculo: Model<IVeiculo> =
  mongoose.models.Veiculo || mongoose.model<IVeiculo>("Veiculo", VeiculoSchema);

export default Veiculo;