
const formulario = document.getElementById("form-ocorrencia");
const botaoCadastrar = document.getElementById("botao-cadastrar");
const botaoAtualizar = document.getElementById("botao-atualizar");
const mensagem = document.getElementById("mensagem");

const listaOcorrencias = document.getElementById("lista-ocorrencias");
const resumoCategorias = document.getElementById("resumo-categorias");

const totalOcorrencias = document.getElementById("total-ocorrencias");
const totalAlta = document.getElementById("total-alta");

const categorias = [
  "Buraco na via",
  "Iluminação pública",
  "Descarte irregular de resíduos",
  "Acessibilidade",
];

// Criação segura de elementos HTML
function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  if (texto !== undefined) {
    elemento.textContent = texto;
  }

  return elemento;
}

// Mensagens de confirmação ou erro
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.hidden = false;
}

// Atualização dos indicadores
function atualizarIndicadores(ocorrencias) {
  const total = ocorrencias.length;

  const altaPrioridade = ocorrencias.filter(
    (ocorrencia) => ocorrencia.prioridade === "Alta"
  ).length;

  totalOcorrencias.textContent = total;
  totalAlta.textContent = altaPrioridade;

  resumoCategorias.replaceChildren();

  // Agrupamento simples por categoria
  categorias.forEach((categoria) => {
    const quantidade = ocorrencias.filter(
      (ocorrencia) => ocorrencia.categoria === categoria
    ).length;

    const linha = criarElemento("div", "resumo-linha");
    const topo = criarElemento("div", "resumo-topo");

    topo.append(
      criarElemento("span", "", categoria),
      criarElemento("strong", "", quantidade)
    );

    const barraFundo = criarElemento("div", "barra-fundo");
    const barra = criarElemento("div", "barra-preenchimento");

    const percentual = total > 0
      ? (quantidade / total) * 100
      : 0;

    barra.style.width = `${percentual}%`;

    barraFundo.appendChild(barra);
    linha.append(topo, barraFundo);

    resumoCategorias.appendChild(linha);
  });
}

// Formatação da data
function formatarData(data) {
  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return "Data não informada";
  }

  return valor.toLocaleString("pt-BR");
}

// Exibição dos registros cadastrados
function apresentarOcorrencias(ocorrencias) {
  listaOcorrencias.replaceChildren();

  if (ocorrencias.length === 0) {
    listaOcorrencias.appendChild(
      criarElemento(
        "p",
        "estado",
        "Nenhuma ocorrência cadastrada até o momento."
      )
    );
    return;
  }

  const classesPrioridade = {
    Alta: "alta",
    Média: "media",
    Baixa: "baixa",
  };

  ocorrencias.forEach((ocorrencia) => {
    const card = criarElemento("article", "ocorrencia");

    const topo = criarElemento("div", "ocorrencia-topo");

    const categoria = criarElemento(
      "span",
      "categoria-nome",
      ocorrencia.categoria
    );

    const classe = classesPrioridade[ocorrencia.prioridade] || "baixa";

    const prioridade = criarElemento(
      "span",
      `prioridade prioridade-${classe}`,
      ocorrencia.prioridade
    );

    topo.append(categoria, prioridade);

    const localizacao = criarElemento(
      "p",
      "ocorrencia-local",
      `Local: ${ocorrencia.localizacao}`
    );

    const descricao = criarElemento(
      "p",
      "ocorrencia-descricao",
      ocorrencia.descricao
    );

    const data = criarElemento(
      "span",
      "ocorrencia-data",
      `Registrado em ${formatarData(ocorrencia.criadoEm)}`
    );

    card.append(topo, localizacao, descricao, data);

    listaOcorrencias.appendChild(card);
  });
}

// GET - Consulta dos dados pela API
async function carregarOcorrencias() {
  listaOcorrencias.replaceChildren(
    criarElemento("p", "estado", "Carregando ocorrências...")
  );

  try {
    const resposta = await fetch("/api/ocorrencias");

    if (!resposta.ok) {
      throw new Error("Erro ao consultar as ocorrências.");
    }

    const ocorrencias = await resposta.json();

    if (!Array.isArray(ocorrencias)) {
      throw new Error("Resposta inesperada do servidor.");
    }

    atualizarIndicadores(ocorrencias);
    apresentarOcorrencias(ocorrencias);
  } catch (erro) {
    listaOcorrencias.replaceChildren(
      criarElemento("p", "estado", erro.message)
    );
  }
}

// POST - Cadastro de uma nova ocorrência
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dados = {
    categoria: formulario.categoria.value.trim(),
    localizacao: formulario.localizacao.value.trim(),
    descricao: formulario.descricao.value.trim(),
    prioridade: formulario.prioridade.value.trim(),
  };

  mensagem.hidden = true;
  botaoCadastrar.disabled = true;
  botaoCadastrar.textContent = "Cadastrando...";

  try {
    const resposta = await fetch("/api/ocorrencias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao cadastrar.");
    }

    formulario.reset();

    mostrarMensagem(
      resultado.mensagem || "Ocorrência cadastrada!",
      "sucesso"
    );

    await carregarOcorrencias();
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  } finally {
    botaoCadastrar.disabled = false;
    botaoCadastrar.textContent = "Cadastrar ocorrência";
  }
});

// Botão para atualizar os registros
botaoAtualizar.addEventListener("click", carregarOcorrencias);

// Carregamento inicial da página
carregarOcorrencias();
