import mongoose, { Document, Model, Schema } from "mongoose";

export interface IViagem extends Document {
  _id: string;
  origem: string;
  destino: string;
  status: string;
  dataAgendada: Date;
  dataInicio: Date | null;
  dataFim: Date | null;
  idMotorista: Schema.Types.ObjectId;
  idVeiculo: Schema.Types.ObjectId;
}

const ViagemSchema: Schema<IViagem> = new Schema({
  origem: { type: String, required: true },
  destino: { type: String, required: true },
  status: {
    type: String,
    enum: ["Agendada", "Em Curso", "Finalizada"],
    default: "Agendada",
  },
  dataAgendada: { type: Date, default: Date.now },
  dataInicio: { type: Date, default: null },
  dataFim: { type: Date, default: null },
  idMotorista: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  idVeiculo: {
    type: Schema.Types.ObjectId,
    ref: "Veiculo",
    required: true,
  },
});

const Viagem: Model<IViagem> =
  mongoose.models.Viagem || mongoose.model<IViagem>("Viagem", ViagemSchema);

export default Viagem;