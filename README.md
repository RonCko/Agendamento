# Agendamento
Plataforma de agendamento de atendimentos
# Apresentação do Projeto – Plataforma de Agendamento de Atendimentos
O projeto consiste no desenvolvimento de uma plataforma de agendamentos para o Departamento de Educação (DEPED) do câmpus Dois Vizinhos, com o objetivo de modernizar e automatizar o processo de marcação de atendimentos entre estudantes e servidores.

A solução proposta é inspirada em ferramentas consolidadas, como o Calendly, permitindo sincronização com agendas já utilizadas (Google Calendar e agenda institucional da UTFPR), além de oferecer diferentes modalidades e tempos de atendimento.

A plataforma será amigável e intuitiva para os estudantes, facilitando o agendamento de atendimentos de forma prática e acessível. Para os servidores do DEPED, serão disponibilizados recursos adicionais, como a emissão de registros de atendimento e a possibilidade de upload de relatórios diretamente no sistema.

Além disso, será avaliada a viabilidade de integração ou adaptação do sistema de agendamento já utilizado no campus Cornélio Procópio, a fim de aproveitar experiências prévias e garantir maior eficiência no desenvolvimento.

Em resumo, o aplicativo visa otimizar a organização dos atendimentos, reduzir a burocracia, melhorar a comunicação entre estudantes e servidores e fornecer uma solução tecnológica confiável para o DEPED.

Link Figma protótipos: https://www.figma.com/design/Xxmg9CIG7ai9eHyDOkdUF5/AgendaDEPED?node-id=0-1&p=f&t=GxJi1QjIIyQ0jlCt-0

Senha para acesso ao supabase: agendamentoutfpr
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

