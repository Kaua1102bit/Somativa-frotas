const mongoose = require('mongoose');

const motoristaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ['gestor', 'motorista'], default: 'motorista' }
});

module.exports = mongoose.model('Motorista', motoristaSchema);
