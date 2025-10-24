import mongoose from "mongoose";

//converter string em URL
const MongoUri = process.env.DATABASE_URL;

//verifica se o .env.local esta declarado
if (!MongoUri) {
  throw new Error("Defina o DATABASE_URL no .env.local");
}

//criar uma variavel para armazenar o cache do sistema

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conectada: null, promessa: null };
}

//função de conexão com o mongodb
async function connectMongo() {
  //verifica se conexão ja existe, se ja existe retorna a propria conexao
  if (cached.conectada) return cached.conectada;

  //verifica se existe uma promessa de conexao
  if (!cached.promessa) {
    //se nula
    const aguarde = { bufferCommands: false }; //desativa o banco de comandos no mongoose
    //caso ocorra a perda de conexao
    //criar uma promessa de conexao
    cached.promessa = mongoose.connect(MongoUri!, aguarde).then((mongoose) => {
      console.log("Conexão estabelecida no Mongo");
      return mongoose;
    });
  }
  //vou estabelecer a conexao
  try {
    //cria a conexao a partir da promessa que estava presente
    cached.conectada = await cached.promessa;
  } catch (error) {
    //caso ocorra algum erro
    cached.promessa = null; //limpo a promessa de conexao
    throw error;
  }

  //a conexao foi estabelecida
  return cached.conectada;
}

//transforma em um componente reutilizavel
export default connectMongo;

//1.passo -> criar o endereco da conexao
//2.passo -> criar o cached para armazenar as conexoes ao longo do projeto
//3.passo -> verificar se ja existe uma conexao estabelecida com o db
//4.passo -> criar uma promessa caso ainda nao exista
//5.passo -> transformar a promessa em uma conexao estabelecida