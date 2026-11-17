
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

app.use(express.json());

// Categorias e prioridades permitidas
const categoriasValidas = [
  "Buraco na via",
  "Iluminação pública",
  "Descarte irregular de resíduos",
  "Acessibilidade",
];

const prioridadesValidas = ["Baixa", "Média", "Alta"];

// Validação das informações recebidas
function validarOcorrencia(dados) {
  const camposObrigatorios = [
    "categoria",
    "localizacao",
    "descricao",
    "prioridade",
  ];

  for (const campo of camposObrigatorios) {
    if (
      typeof dados[campo] !== "string" ||
      !dados[campo].trim()
    ) {
      return `O campo "${campo}" é obrigatório.`;
    }
  }

  if (!categoriasValidas.includes(dados.categoria.trim())) {
    return "Categoria inválida.";
  }

  if (!prioridadesValidas.includes(dados.prioridade.trim())) {
    return "Prioridade inválida.";
  }

  if (dados.localizacao.trim().length > 150) {
    return "A localização deve ter no máximo 150 caracteres.";
  }

  if (dados.descricao.trim().length > 500) {
    return "A descrição deve ter no máximo 500 caracteres.";
  }

  return null;
}

// GET - Verificar funcionamento da aplicação
app.get("/api/saude", (req, res) => {
  res.status(200).json({
    status: "ok",
    aplicacao: "CitizenTech",
    banco: "conectado",
  });
});

// POST - Cadastrar uma ocorrência
app.post("/api/ocorrencias", async (req, res) => {
  try {
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        erro: "Envie os dados da ocorrência em formato JSON.",
      });
    }

    const erroValidacao = validarOcorrencia(req.body);

    if (erroValidacao) {
      return res.status(400).json({
        erro: erroValidacao,
      });
    }

    const novaOcorrencia = {
      categoria: req.body.categoria.trim(),
      localizacao: req.body.localizacao.trim(),
      descricao: req.body.descricao.trim(),
      prioridade: req.body.prioridade.trim(),
      criadoEm: new Date(),
    };

    const colecao = req.app.locals.banco.collection("ocorrencias");

    const resultado = await colecao.insertOne(novaOcorrencia);

    return res.status(201).json({
      mensagem: "Ocorrência cadastrada com sucesso!",
      ocorrencia: {
        id: resultado.insertedId.toString(),
        ...novaOcorrencia,
      },
    });
  } catch (erro) {
    console.error("Erro ao cadastrar ocorrência:", erro);

    return res.status(500).json({
      erro: "Erro interno ao cadastrar ocorrência.",
    });
  }
});

// GET - Listar ocorrências cadastradas
app.get("/api/ocorrencias", async (req, res) => {
  try {
    const colecao = req.app.locals.banco.collection("ocorrencias");

    const registros = await colecao
      .find()
      .sort({ criadoEm: -1 })
      .toArray();

    const ocorrencias = registros.map((registro) => ({
      id: registro._id.toString(),
      categoria: registro.categoria,
      localizacao: registro.localizacao,
      descricao: registro.descricao,
      prioridade: registro.prioridade,
      criadoEm: registro.criadoEm,
    }));

    return res.status(200).json(ocorrencias);
  } catch (erro) {
    console.error("Erro ao consultar ocorrências:", erro);

    return res.status(500).json({
      erro: "Erro interno ao consultar ocorrências.",
    });
  }
});

// Tratamento de rotas inexistentes
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada.",
  });
});

// Tratamento de erros gerais, incluindo JSON inválido
app.use((erro, req, res, next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({
      erro: "JSON inválido.",
    });
  }

  console.error("Erro inesperado:", erro);

  return res.status(500).json({
    erro: "Erro interno do servidor.",
  });
});

// Inicialização da aplicação
async function iniciarServidor() {
  try {
    await cliente.connect();

    const banco = cliente.db("citizentech");
    await banco.command({ ping: 1 });

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
