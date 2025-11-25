#!/usr/bin/env node
/*
  Script para criar um agendamento de teste via Supabase.
  Uso:
    node scripts/addTestAgendamento.js --email teste@exemplo.com --setor_id 1 --date 2025-11-26 --time 09:00
  Se você não fornecer --email, poderá fornecer --aluno_id diretamente.
  Requer que `SUPABASE_URL` e `SUPABASE_ANON_KEY` estejam configuradas como env vars.
*/

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios. Verifique seu .env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const email = argv.email;
  const alunoIdArg = argv.aluno_id;
  const setorId = argv.setor_id || argv.setor || argv.setorId || 1;
  const date = argv.date || new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10); // YYYY-MM-DD default tomorrow
  const time = argv.time || '09:00';

  let alunoId = alunoIdArg;
  if (!alunoId && email) {
    const { data, error } = await supabase.from('aluno').select('id').eq('email', email).maybeSingle();
    if (error) {
      console.error('Erro ao buscar aluno por email:', error);
      process.exit(1);
    }
    if (!data || !data.id) {
      console.error('Aluno não encontrado com email:', email);
      process.exit(1);
    }
    alunoId = data.id;
  }

  if (!alunoId) {
    console.error('Informe --aluno_id ou --email para identificar o aluno.');
    process.exit(1);
  }

  const dateTime = `${date} ${time}:00`;

  try {
    const { data, error } = await supabase
      .from('agendamento')
      .insert([
        {
          aluno_id: alunoId,
          setor_id: setorId,
          data_hora: dateTime,
          status: 'pendente',
        },
      ])
      .select();

    if (error) {
      console.error('Erro ao criar agendamento:', error);
      process.exit(1);
    }

    console.log('Agendamento criado com sucesso:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Erro inesperado:', err);
    process.exit(1);
  }
}

main();
