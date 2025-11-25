# Agendamento (Plataforma de Atendimentos do DEPED)

Aplicativo móvel para gerenciar agendamentos entre estudantes e servidores do Departamento de Educação (DEPED) — campus Dois Vizinhos (UTFPR). Esta implementação usa Expo + React Native, com Supabase para autenticação e backend.

> Este README descreve como executar o projeto localmente, como configurar o Supabase em desenvolvimento e onde encontrar os principais pontos da aplicação.

---

## Índice
- Visão geral
- Funcionalidades
- Arquitetura e estrutura do projeto
- Pré-requisitos
- Instalação e execução (desenvolvimento)
- Configuração do Supabase
- Testes manuais (fluxo principal)
- Screenshots (exemplos)
- Contribuindo
- Notas de segurança e problemas conhecidos

---

## Visão geral

O projeto tem como objetivo facilitar a marcação de atendimentos acadêmicos, com perfis para: alunos (marcam atendimento), TAs/servidores (confirmam/cancelam) e administradores (dashboard). Possui também um bot assistente e integração inicial com Supabase.

---

## Funcionalidades principais
- Cadastro e login de usuários (Supabase Auth)
- Busca por setor/setores (visualização do bloco e sala)
- Seleção de data via Date Picker e horários disponíveis (intervalos de 30 minutos entre 07:00 e 23:00)
- Persistência de agendamentos (local via AsyncStorage; integração e consultas via Supabase)
- Tela de listagem de agendamentos e opção de cancelar
- Rotas com React Navigation (tabs e stack)

---

## Arquitetura e estrutura do repositório
Pontos principais:

- `src/screens/` - telas da aplicação (HomeScreen, SearchScreen, AgendamentoScreen, PerfilScreen, etc.)
- `src/navigation/` - configurações de navegação (Tabs, Stacks)
- `src/components/` - componentes reutilizáveis (Header, etc.)
- `src/lib/supabase.js` - cliente do Supabase (agora lê a configuração via env/app.json)
- `assets/` - imagens, logos e ícones
- `app.json` - configuração do Expo

---

## Pré-requisitos
- Node.js (recomendado 18.x ou 16.x)
- npm ou yarn
- Expo CLI (opcional, pode usar `npx expo start` sem instalar globalmente)

Instale o Expo CLI globalmente (opcional):

```bash
npx expo --version
# ou
npm install -g expo-cli
```

---

## Instalação e execução (desenvolvimento)

1. Clone o repositório:

```bash
git clone https://github.com/RonCko/Agendamento.git
cd Agendamento/agendamento
```

2. Instale dependências:

```bash
npm install
# ou
yarn
```

3. Inicie o servidor do Expo:

```bash
npm start
# ou
npx expo start
```

4. Rode no emulador/dispositivo:

```bash
npm run android   # iniciar no Android (emulador ou dispositivo)
npm run ios       # iniciar no iOS (macOS + emulador Xcode)
npm run web       # iniciar no navegador
```

---

## Configuração do Supabase

1. Crie um projeto Supabase em https://supabase.com e anote a URL e a ANON KEY.

2. Configure variáveis de ambiente para desenvolvimento usando uma das opções abaixo. Nunca comite a ANON KEY em repositórios públicos.

- Opção A — `.env` local (recomendado para desenvolvimento rápido):

   a) Crie um arquivo `.env` na raiz do projeto (adicione `.env` ao `.gitignore`).

   b) Exemplo de conteúdo:

   ```bash
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua_anon_key
   ```

   c) Para carregar em desenvolvimento com `dotenv`, instale e configure conforme preferir. Alternativamente, use `app.config.js` para puxar env variables para `app.json`.

- Opção B — `app.json` (útil para builds EAS):

   ```json
   "expo": {
      "extra": {
         "SUPABASE_URL": "https://seu-projeto.supabase.co",
         "SUPABASE_ANON_KEY": "sua_anon_key"
      }
   }
   ```

- Opção C — EAS secrets (recomendado para produção):

   ```bash
   eas secret:create --name SUPABASE_URL --value "https://seu-projeto.supabase.co"
   eas secret:create --name SUPABASE_ANON_KEY --value "sua_anon_key"
   ```

3. O projeto já foi atualizado para ler as chaves do ambiente a partir de `process.env` ou de `Constants.expoConfig.extra` (veja `src/lib/supabase.js`).

**Observação**: Evite manter chaves sensíveis no repositório. Use `.env` local apenas para desenvolvimento e `EAS secrets` para builds de produção.

---

## Testes manuais (fluxo principal)

1. Abra o app (Expo) e faça login (se necessário). Caso não haja usuários cadastrados, crie uma conta de teste.
2. Acesse a aba "Buscar" e escolha um setor.
3. Selecione a data e um horário livre e confirme o agendamento.
4. Ao voltar à aba "Início", verifique se o agendamento foi salvo e aparece em "Meus atendimentos".
   - Observação: A tela de "Início" foi implementada para recarregar agendamentos sempre que ganhar foco, portanto o novo agendamento deve aparecer sem reiniciar o app.
5. Teste o cancelamento do agendamento e confirme que a lista é atualizada.

### Teste detalhado (exemplo)

1. Crie uma conta de teste (Sign Up) ou use um usuário já existente.
2. Abra a aba "Buscar" e selecione, por exemplo, o setor "DEPED".
3. Clique para agendar, selecione uma data (ex.: 2025-10-16) e escolha um horário disponível.
4. Clique em "Confirmar".
5. A página deve voltar à aba Início e o novo agendamento aparecer na lista "Meus atendimentos".
6. Clique em "Cancelar" para remover o agendamento e confirme que o item desaparece.

Caso algo não funcione:
- Verifique o console do Metro (terminal do `npm start`) para ver erros.
- Confirme as variáveis de ambiente do Supabase (veja a seção Configuração do Supabase).
- Confira se o dispositivo/emulador tem conexão com a internet (caso esteja usando Supabase remote).

---

## Script de teste (inserir agendamento via Supabase)

Para facilitar testes automatizados/manual, há um script Node que usa o cliente do Supabase para inserir um agendamento de teste.

Localização: `scripts/addTestAgendamento.js`

Exemplo de uso (requer `SUPABASE_URL` e `SUPABASE_ANON_KEY` no ambiente ou em `.env`):

```bash
# com npm (usa dotenv automaticamente):
npm run add-test -- --email teste@exemplo.com --setor_id 1 --date 2025-11-26 --time 09:00

# Direto com node (se preferir):
node -r dotenv/config scripts/addTestAgendamento.js --email teste@exemplo.com --setor_id 1 --date 2025-11-26 --time 09:00
```

Parâmetros:
- `--email` (opcional): email do `aluno` que já exista no Supabase; o script irá buscar o `aluno_id` a partir do email.
- `--aluno_id` (alternativa): fornecer `aluno_id` diretamente.
- `--setor_id` (opcional): ID do setor (padrão 1).
- `--date` (opcional): data no formato `YYYY-MM-DD` (padrão: amanhã).
- `--time` (opcional): horário `HH:MM` (padrão: `09:00`).

Se houver erro ao inserir (por políticas RLS ou permissões), verifique a configuração das policies da tabela `agendamento` e se o `anon key` utilizado tem permissão.


## Screenshots (exemplos)

As imagens de exemplo estão no diretório `assets/images/`. Substitua por capturas reais, se desejar.

![Logo do Agendamento](assets/images/Agendamento_logo.png)
![Bot e protótipos](assets/images/chatbot.png)
![Avatar padrão](assets/images/perfil-blank.png)

---

## Contribuindo

1. Fork o repositório
2. Crie uma branch com o nome da feature: `git checkout -b feat/minha-feature`
3. Faça commits pequenos e claros
4. Abra um Pull Request (PR) descrevendo a mudança e testes realizados

Boas práticas:
- Não comite segredos
- Documente alterações na estrutura do banco (Supabase) e endpoints

---

## Notas de segurança e problemas conhecidos

- O projeto não deve deixar a ANON KEY hardcoded: prefira `app.json` extra, `.env` local (non-comitted) ou `EAS secrets`.
- Problema Metro: "TypeError: dependencies is not iterable" — investigação inicial aponta para possíveis incompatibilidades de dependências/transformers. Se ocorrer, rode o Expo em modo debug e coloque o stack trace em uma issue.

---

## Contato

Para dúvidas, problemas ou contribuições, abra uma issue no repositório ou mande um PR.

Obrigado por colaborar! 💡
---
# Plataforma de Agendamentos – DEPED (UTFPR Dois Vizinhos)

Este projeto foi desenvolvido para modernizar e automatizar o processo de agendamento de atendimentos entre estudantes e servidores do Departamento de Educação (DEPED) do câmpus Dois Vizinhos da UTFPR.
A plataforma é simples, intuitiva e inspirada em ferramentas como o Calendly, mas adaptada para a realidade acadêmica.

---

## Visão Geral

A solução permite que estudantes realizem agendamentos nos setores da faculdade, enquanto os servidores podem confirmar ou cancelar esses atendimentos.
O sistema inclui também um dashboard administrativo e um bot que auxilia alunos com informações sobre os setores.

---

## Perfis de Usuário

### Aluno
- Visualiza todos os setores disponíveis.
- Realiza agendamentos de forma prática.
- Pode interagir com o botTed para:
  - Obter informações dos setores.
  - Ver a localização dos setores.
  - Tirar dúvidas rápidas.

### TA (Servidor do Setor)
- Visualiza agendamentos pendentes.
- Pode confirmar ou cancelar agendamentos feitos pelos alunos.

### Admin
- Possui acesso a um dashboard completo com estatísticas, incluindo:
  - Quantidade total de atendimentos.
  - Setores mais movimentados.
  - Horários e dias de maior demanda.
  - Situação geral dos agendamentos (pendentes, confirmados, cancelados).
- Acesso completo aos atendimentos de todos os setores.

---

## Integrações (Planejadas ou em Estudo)

- Google Calendar
- Agenda institucional da UTFPR
- Possível integração com o sistema já utilizado no câmpus Cornélio Procópio

---

## Tecnologias Utilizadas

- Expo (React Native)
- JavaScript/TypeScript
- Supabase (autenticação e banco de dados)
- API auxiliar do botTed

---

## Estrutura Geral do Repositório

O repositório contém:
- Código-fonte da aplicação
- Protótipos e telas de referência
- Arquivos auxiliares de apoio ao desenvolvimento

---

## Como Executar o Projeto

1. Clone o repositório:
   ```
   git clone https://github.com/RonCko/Agendamento
````

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o projeto:

   ```bash
   npm start
   ```

4. Abra o aplicativo Expo Go e escaneie o QR Code exibido no terminal ou na interface web.

---

## Protótipos

Os protótipos estão disponíveis no próprio repositório e mostram o fluxo de uso da aplicação para alunos, TAs e administradores.

