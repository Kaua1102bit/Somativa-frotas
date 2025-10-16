const mongoose = require('mongoose');

const veiculoSchema = new mongoose.Schema({
  placa: { type: String, required: true, unique: true },
  modelo: { type: String, required: true },
  ano: { type: Number, required: true },
  kmAtual: { type: Number, required: true },
  ultimaManutencaoKm: { type: Number, default: 0 }
});

module.exports = mongoose.model('Veiculo', veiculoSchema);
