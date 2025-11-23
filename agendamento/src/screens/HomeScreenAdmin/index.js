import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import HeaderTed from '../../components/HeaderTed';
import styles from './styles';

const HomeScreenAdmin = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadAgendamentos();
    }, [])
  );

  async function loadAgendamentos() {
    try {
      setLoading(true);
      
      // Buscar todos os agendamentos pendentes de todos os setores
      const { data: agendamentosData, error: agendError } = await supabase
        .from('agendamento')
        .select('id, data_hora, status, aluno_id, setor_id')
        .eq('status', 'pendente')
        .order('data_hora', { ascending: true });

      if (agendError) {
        console.error('Erro ao buscar agendamentos:', agendError);
        return;
      }

      // Buscar dados dos alunos e setores para cada agendamento
      const agendamentosCompletos = await Promise.all(
        (agendamentosData || []).map(async (agendamento) => {
          const [alunoResult, setorResult] = await Promise.all([
            supabase
              .from('aluno')
              .select('id, nome, RA')
              .eq('id', agendamento.aluno_id)
              .single(),
            supabase
              .from('setor')
              .select('id, nome, localiza')
              .eq('id', agendamento.setor_id)
              .single()
          ]);

          return {
            ...agendamento,
            aluno: alunoResult.data || null,
            setor: setorResult.data || null
          };
        })
      );

      setAgendamentos(agendamentosCompletos);
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
        <Text style={styles.title}>Todos os Agendamentos</Text>
        <Text style={styles.subtitle}>Administrador - Todos os setores</Text>

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
                <View style={styles.cardHeader}>
                  <View style={styles.setorBadge}>
                    <Text style={styles.setorBadgeText}>
                      {item.setor?.nome || 'Setor'}
                    </Text>
                  </View>
                  <Text style={styles.setorLocaliza}>
                    {item.setor?.localiza || 'Localização não informada'}
                  </Text>
                </View>

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

export default HomeScreenAdmin;
