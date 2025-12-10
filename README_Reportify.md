# 🤖 Reportify Discord Bot + Gemini AI Integration

Automatize a geração, leitura e resumo de relatórios do Reportfy diretamente em um canal do **Discord**, com ajuda da **IA Gemini** do Google.

O bot roda automaticamente via **GitHub Actions**, utilizando **variáveis de ambiente e secrets** para proteger suas credenciais.

---

## 🧩 Funcionalidades

- 📊 Gera relatórios automáticos com o **Reportify**
- 📁 Lê o último relatório `.md` gerado dentro da pasta `Reports/`
- 🤖 Gera resumos inteligentes com o **Google Gemini API**
- 💬 Envia os relatórios e resumos em um **canal do Discord**
- 🔒 Usa **GitHub Secrets** para armazenar chaves de forma segura
- ⚙️ Pode rodar manualmente ou de forma agendada via **GitHub Actions**

---

## ⚙️ Estrutura do Projeto

```bash
├── .github/
│   └── workflows/
│       └── run_bot.yml        # Workflow do GitHub Actions
├── bot_reportify.py           # Código principal do bot
├── requirements.txt           # Dependências do projeto
└── README.md                  # Este arquivo
```
## ⚙️ Arquivo de configuração

- Crie um requirementS.txt com o seguinte conteudo.
  ```bash
  discord.py
  python-dotenv
  requests
  reportify-ifes
  ```
## ⚙️ Configuração das Variáveis Secretas (GitHub Secrets)

O projeto utiliza variáveis de ambiente seguras configuradas no GitHub.

```bash
Seu repositório → Settings → Secrets and variables → Actions → New repository secret
```
Crie as seguintes secrets.
```
MY_API_DISCORDBOT_REPORTFY
GEMINI_API_KEY
DISCORD_CHANNEL_ID
GITHUB_TOKEN
GITHUB_REPOSITORY
```
## ⚡ Configurando o Workflow (GitHub Actions)

Crie o arquivo .github/workflows/run_bot.yml com o conteúdo abaixo:
```
name: ReportifyBot Run

on:
  workflow_dispatch:   # permite rodar manualmente pelo GitHub
  schedule:
    - cron: "0 19 * * *"   # HORARIO DE EXEMPLO QUE ESTA CONFIGURADO PARA 16:15 (MEU HORARIO DE DESCANSO/LANCHE NO ESTAGIO PRA MONITORAR O BOT)

jobs:
  run-bot:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do repositório
        uses: actions/checkout@v3

      - name: Configurar Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.10"

      - name: Instalar dependências
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Rodar bot (relatório + resumo)
        env:
          MY_API_DISCORDBOT_REPORTFY: ${{ secrets.DISCORD_BOT_TOKEN }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          DISCORD_CHANNEL_ID: ${{ secrets.DISCORD_CHANNEL_ID }}
          GITHUB_TOKEN: ${{ secrets.REPORTFY_GITHUB_TOKEN }}
          GITHUB_REPOSITORY: ${{ secrets.REPOSITORY }}
          
        run: python ReportfyBot.py
        
```
## 🧠 Como o Bot via Actions Funciona?

- 1️⃣ Inicialização O GitHub Actions inicia o workflow, instala as dependências e lê as variáveis secretas. 

- 2️⃣ Execução do Reportify O bot executa o Reportify automaticamente (sem interação humana), simulando a entrada do usuário com unittest.mock.patch. Isso gera relatórios .md dentro da pasta Reports/. 

- 3️⃣ Leitura do Relatório A função ler_ultimo_arquivo_md(): Localiza o diretório mais recente em ./Reports/ Lê todos os arquivos que começam com developer_stats_ Junta tudo em um único texto 

- 4️⃣ Geração do Resumo O conteúdo é enviado à API Gemini (Google) via requisição POST. A IA gera um resumo em Português-BR, com: Comparativo Prometido vs Realizado Throughput (quantas issues fechadas) Nome do desenvolvedor entre colchetes [ ] Observações sobre padrão de contribuição e papel no time 

- 5️⃣ Envio ao Discord O bot envia: Mensagens de status (ex: “🚀 Iniciando geração de relatório...”) O resumo gerado, dividido em blocos de até 2000 caracteres. Com uma mensagem final de sucesso ✅
- *OBS: em caso de erros da API ou da I.A, ele vai relatar o tipo de erro e o numero dele.*
