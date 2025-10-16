const mongoose = require('mongoose');

const viagemSchema = new mongoose.Schema({
  veiculo: { type: mongoose.Schema.Types.ObjectId, ref: 'Veiculo', required: true },
  motorista: { type: mongoose.Schema.Types.ObjectId, ref: 'Motorista', required: true },
  origem: { type: String, required: true },
  destino: { type: String, required: true },
  status: { type: String, enum: ['Agendada', 'Em Curso', 'Finalizada'], default: 'Agendada' },
  kmFinal: { type: Number }
});

module.exports = mongoose.model('Viagem', viagemSchema);
