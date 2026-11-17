
import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const porta = Number(process.env.PORTA || 3000);
const uriMongoDB = process.env.MONGODB_URI;

if (!uriMongoDB) {
  throw new Error("MONGODB_URI não foi definida no arquivo .env");
}

const cliente = new MongoClient(uriMongoDB, {
  serverSelectionTimeoutMS: 5000,
});

// Middleware para receber dados JSON
app.use(express.json());

// Rota de verificação do servidor
app.get("/api/saude", (req, res) => {
  res.status(200).json({
    status: "ok",
    aplicacao: "CitizenTech",
    banco: "conectado",
  });
});

// Tratamento de rotas inexistentes
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada.",
  });
});

// Inicialização da aplicação
async function iniciarServidor() {
  try {
    await cliente.connect();

    const banco = cliente.db("citizentech");
    await banco.command({ ping: 1 });

    // Disponibiliza o banco para as próximas rotas
    app.locals.banco = banco;

    console.log("MongoDB conectado com sucesso!");

    app.listen(porta, () => {
      console.log(`Servidor rodando em http://localhost:${porta}`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar a aplicação:", erro.message);
    process.exit(1);
  }
}

iniciarServidor();
