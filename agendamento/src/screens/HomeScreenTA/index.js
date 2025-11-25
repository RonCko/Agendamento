import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import HeaderTed from '../../components/HeaderTed';
import styles from './styles';

const HomeScreenTA = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setorId, setSetorId] = useState(null);
  const [activeTab, setActiveTab] = useState('pendentes'); // 'pendentes' ou 'confirmados'

  useEffect(() => {
    loadTecAdmData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (setorId) {
        loadAgendamentos();
      }
    }, [setorId, activeTab])
  );

  async function loadTecAdmData() {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Erro de autenticação:', authError);
        await supabase.auth.signOut();
        return;
      }
      
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
      
      // Buscar agendamentos baseado na aba ativa
      const statusFiltro = activeTab === 'pendentes' ? 'pendente' : 'confirmado';
      
      const { data: agendamentosData, error: agendError } = await supabase
        .from('agendamento')
        .select('id, data_hora, status, aluno_id')
        .eq('setor_id', setorId)
        .eq('status', statusFiltro)
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

  async function concluir(id) {
    Alert.alert(
      'Concluir atendimento',
      'Marcar este atendimento como concluído?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Concluir',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('agendamento')
                .update({ status: 'concluido' })
                .eq('id', id);

              if (error) throw error;

              Alert.alert('Sucesso', 'Atendimento marcado como concluído!');
              loadAgendamentos();
            } catch (error) {
              console.error('Erro ao concluir atendimento:', error);
              Alert.alert('Erro', 'Não foi possível concluir o atendimento.');
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
        {/* Tabs para alternar entre Pendentes e Confirmados */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'pendentes' && styles.tabActive]}
            onPress={() => setActiveTab('pendentes')}
          >
            <Text style={[styles.tabText, activeTab === 'pendentes' && styles.tabTextActive]}>
              Pendentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'confirmados' && styles.tabActive]}
            onPress={() => setActiveTab('confirmados')}
          >
            <Text style={[styles.tabText, activeTab === 'confirmados' && styles.tabTextActive]}>
              Confirmados
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          {activeTab === 'pendentes' ? 'Agendamentos Pendentes' : 'Agendamentos Confirmados'}
        </Text>
        <Text style={styles.subtitle}>
          {activeTab === 'pendentes' ? 'Confirmações do seu setor' : 'Atendimentos a realizar'}
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fecc00ff" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : agendamentos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'pendentes' 
                ? 'Não há agendamentos pendentes no momento.'
                : 'Não há agendamentos confirmados no momento.'
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={agendamentos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={loadAgendamentos}
                colors={['#fecc00ff']}
                tintColor="#fecc00ff"
              />
            }
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
                  {activeTab === 'pendentes' ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <TouchableOpacity 
                        onPress={() => concluir(item.id)} 
                        style={[styles.actionButton, styles.concluirButton]}
                      >
                        <Text style={styles.concluirText}>Concluir</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => cancelar(item.id)} 
                        style={[styles.actionButton, styles.cancelButton]}
                      >
                        <Text style={styles.cancelText}>Cancelar</Text>
                      </TouchableOpacity>
                    </>
                  )}
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
