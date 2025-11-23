import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import HeaderTed from '../../components/HeaderTed';
import styles from './styles';

const HomeScreenTA = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setorId, setSetorId] = useState(null);

  useEffect(() => {
    loadTecAdmData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (setorId) {
        loadAgendamentos();
      }
    }, [setorId])
  );

  async function loadTecAdmData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
      const { data, error } = await supabase
        .from('tec_adm')
        .select('setor_id')
        .eq('email', session.user.email)
        .single();        if (data && !error) {
          setSetorId(data.setor_id);
        } else {
          console.error('Erro ao buscar dados do TA:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do TA:', error);
    }
  }

  async function loadAgendamentos() {
    if (!setorId) return;

    try {
      setLoading(true);
      
      // Buscar agendamentos pendentes do setor
      const { data: agendamentosData, error: agendError } = await supabase
        .from('agendamento')
        .select('id, data_hora, status, aluno_id')
        .eq('setor_id', setorId)
        .eq('status', 'pendente')
        .order('data_hora', { ascending: true });

      if (agendError) {
        console.error('Erro ao buscar agendamentos:', agendError);
        return;
      }

      // Buscar dados dos alunos para cada agendamento
      const agendamentosComAlunos = await Promise.all(
        (agendamentosData || []).map(async (agendamento) => {
          const { data: alunoData, error: alunoError } = await supabase
            .from('aluno')
            .select('id, nome, RA')
            .eq('id', agendamento.aluno_id)
            .single();

          if (alunoError) {
            console.error('Erro ao buscar aluno:', alunoError);
          }

          return {
            ...agendamento,
            aluno: alunoData || null
          };
        })
      );

      setAgendamentos(agendamentosComAlunos);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function confirmar(id) {
    Alert.alert(
      'Confirmar agendamento',
      'Tem certeza que deseja confirmar este agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('agendamento')
                .update({ status: 'confirmado' })
                .eq('id', id);

              if (error) throw error;

              Alert.alert('Sucesso', 'Agendamento confirmado!');
              loadAgendamentos();
            } catch (error) {
              console.error('Erro ao confirmar agendamento:', error);
              Alert.alert('Erro', 'Não foi possível confirmar o agendamento.');
            }
          }
        }
      ]
    );
  }

  async function cancelar(id) {
    Alert.alert(
      'Cancelar agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('agendamento')
                .update({ status: 'cancelado' })
                .eq('id', id);

              if (error) throw error;

              Alert.alert('Sucesso', 'Agendamento cancelado.');
              loadAgendamentos();
            } catch (error) {
              console.error('Erro ao cancelar agendamento:', error);
              Alert.alert('Erro', 'Não foi possível cancelar o agendamento.');
            }
          }
        }
      ]
    );
  }

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month} às ${hours}:${minutes}`;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HeaderTed />
      <View style={styles.content}>
        <Text style={styles.title}>Agendamentos Pendentes</Text>
        <Text style={styles.subtitle}>Confirmações do seu setor</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fecc00ff" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : agendamentos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Não há agendamentos pendentes no momento.
            </Text>
          </View>
        ) : (
          <FlatList
            data={agendamentos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => (
              <View style={styles.agendamentoCard}>
                <View style={styles.agendamentoHeader}>
                  <Text style={styles.alunoNome}>
                    {item.aluno?.nome || 'Nome não disponível'}
                  </Text>
                  <Text style={styles.alunoRa}>
                    RA: {item.aluno?.RA ? `a${item.aluno.RA}` : 'RA não disponível'}
                  </Text>
                </View>
                
                <Text style={styles.dataHora}>
                  {formatDateTime(item.data_hora)}
                </Text>

                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    onPress={() => confirmar(item.id)} 
                    style={[styles.actionButton, styles.confirmButton]}
                  >
                    <Text style={styles.confirmText}>Confirmar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => cancelar(item.id)} 
                    style={[styles.actionButton, styles.cancelButton]}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreenTA;
