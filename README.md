
# CitizenTech — Monitoramento de Ocorrências Urbanas

**Global Solution 2026.2 — Application Development**

**FIAP | Ciência da Computação — 2º ano**

## 1. Sobre o projeto

O CitizenTech é uma aplicação web desenvolvida para registrar e consultar problemas relacionados à infraestrutura urbana.

A solução permite que cidadãos cadastrem ocorrências como buracos nas vias, iluminação pública inadequada, descarte irregular de resíduos e problemas de acessibilidade.

Os registros ficam armazenados em um banco de dados MongoDB e podem ser consultados por meio de uma interface web.

## 2. Problema, público-alvo e objetivo

**Problema:** dificuldades de infraestrutura urbana afetam a mobilidade, a segurança e a qualidade de vida da população.

**Público-alvo:** moradores de comunidades urbanas e, potencialmente, equipes responsáveis pela manutenção dos espaços públicos.

**Objetivo:** facilitar o registro de problemas urbanos e organizar informações que possam auxiliar na identificação de necessidades e prioridades.

A aplicação é um protótipo acadêmico e não realiza encaminhamento automático de solicitações aos órgãos públicos.

## 3. ODS relacionado

**ODS 11 — Cidades e Comunidades Sustentáveis**

O projeto está alinhado à proposta de tornar as cidades mais inclusivas, seguras, resilientes e sustentáveis, utilizando tecnologia para organizar informações sobre problemas de infraestrutura.

## 4. Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- MongoDB
- Dotenv

## 5. Funcionalidades

- Cadastro de ocorrências urbanas.
- Classificação por categoria e prioridade.
- Validação dos campos obrigatórios.
- Armazenamento dos registros no MongoDB.
- Listagem das ocorrências cadastradas.
- Indicadores atualizados a partir dos registros.
- Mensagens de sucesso e erro.
- Tratamento de rotas inexistentes com HTTP 404.
- Interface responsiva.

## 6. Indicadores

A aplicação apresenta três indicadores:

**Total de ocorrências:** quantidade total de registros cadastrados.

**Alta prioridade:** quantidade de ocorrências classificadas com prioridade alta.

**Ocorrências por categoria:** distribuição dos registros entre buracos nas vias, iluminação pública, descarte irregular de resíduos e acessibilidade.

Os indicadores são calculados em JavaScript a partir dos registros consultados na API.

## 7. Como executar

### Pré-requisitos

- Node.js e npm instalados.
- MongoDB Community Server instalado e em execução.

### Instalação

1. Abra a pasta do projeto no terminal.
2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência.

Configuração padrão:

```env
PORTA=3000
MONGODB_URI=mongodb://127.0.0.1:27017
```

4. Inicie o servidor:

```bash
npm start
```

5. Acesse no navegador:

http://localhost:3000

O banco de dados `citizentech` e a coleção `ocorrencias` serão utilizados para armazenar os registros.

## 8. Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/saude | Verifica o funcionamento da aplicação |
| GET | /api/ocorrencias | Lista os registros cadastrados |
| POST | /api/ocorrencias | Cadastra uma nova ocorrência |

### Campos de uma ocorrência

- `categoria`: categoria do problema.
- `localizacao`: endereço ou referência do local.
- `descricao`: descrição do problema.
- `prioridade`: Baixa, Média ou Alta.

A data do cadastro é gerada automaticamente pelo servidor.

## 9. Vídeo pitch

Link da apresentação: [https://youtu.be/QUoAUGBewjw]

## 10. Considerações finais

O CitizenTech demonstra como uma aplicação web pode utilizar cadastro, armazenamento e processamento de dados para organizar informações relevantes à comunidade.

O protótipo pode ser expandido futuramente com geolocalização, acompanhamento do andamento das solicitações e integração com serviços públicos.
