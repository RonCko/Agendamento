import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import styles from './styles';
import HeaderTed from '../../components/HeaderTed';
import { supabase } from '../../lib/supabase';

// Configurar calendário em português
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function HomeScreen() {
  const [selected, setSelected] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alunoId, setAlunoId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Buscar ID do aluno autenticado
  useEffect(() => {
    loadUserData();
  }, []);

  // Carregar agendamentos quando mudar a data selecionada ou modo de visualização
  useEffect(() => {
    if (alunoId) {
      loadAgendamentos();
    }
  }, [selected, alunoId, showHistory]);

  // Recarregar quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      if (alunoId) {
        loadAgendamentos();
      }
    }, [alunoId, selected, showHistory])
  );

  async function loadUserData() {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Erro de autenticação:', authError);
        await supabase.auth.signOut();
        return;
      }
      
      if (session?.user?.email) {
        const { data, error } = await supabase
          .from('aluno')
          .select('id')
          .eq('email', session.user.email)
          .single();
        
        if (data && !error) {
          setAlunoId(data.id);
          
          // Definir data atual como padrão
          if (!selected) {
            const today = new Date().toISOString().split('T')[0];
            setSelected(today);
          }
        } else {
          console.error('Erro ao buscar ID do aluno:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  async function loadAgendamentos() {
    if (!alunoId) return;

    try {
      setLoading(true);
      
      if (showHistory) {
        // Carregar histórico (agendamentos passados)
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('agendamento')
          .select(`
            id,
            data_hora,
            status,
            setor_id,
            setor (
              id,
              nome,
              localiza
            )
          `)
          .eq('aluno_id', alunoId)
          .lt('data_hora', `${today} 00:00:00`)
          .order('data_hora', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Erro ao buscar histórico:', error);
          setAgendamentos([]);
        } else {
          setAgendamentos(data || []);
        }
      } else if (selected) {
        // Carregar agendamentos da data selecionada
        const { data, error } = await supabase
          .from('agendamento')
          .select(`
            id,
            data_hora,
            status,
            setor_id,
            setor (
              id,
              nome,
              localiza
            )
          `)
          .eq('aluno_id', alunoId)
          .gte('data_hora', `${selected} 00:00:00`)
          .lte('data_hora', `${selected} 23:59:59`)
          .order('data_hora', { ascending: true });

        if (error) {
          console.error('Erro ao buscar agendamentos:', error);
          setAgendamentos([]);
        } else {
          setAgendamentos(data || []);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  }

  async function cancelar(id) {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              const { error } = await supabase
                .from('agendamento')
                .update({ status: 'cancelado' })
                .eq('id', id);

              if (error) {
                console.error('Erro ao cancelar agendamento:', error);
                Alert.alert('Erro', 'Não foi possível cancelar o agendamento.');
              } else {
                Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
                loadAgendamentos();
              }
            } catch (error) {
              console.error('Erro ao cancelar agendamento:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao cancelar o agendamento.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  }

  function formatDateTime(dataHora) {
    if (!dataHora) return '';
    
    const date = new Date(dataHora);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  function getStatusColor(status) {
    switch (status) {
      case 'pendente': return '#FFA500';
      case 'confirmado': return '#4CAF50';
      case 'cancelado': return '#F44336';
      case 'concluido': return '#2196F3';
      default: return '#999';
    }
  }

  function getStatusText(status) {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'confirmado': return 'Confirmado';
      case 'cancelado': return 'Cancelado';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <HeaderTed />
      
      {/* Botão toggle para alternar entre calendário e histórico */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, !showHistory && styles.toggleButtonActive]}
          onPress={() => setShowHistory(false)}
        >
          <Text style={[styles.toggleText, !showHistory && styles.toggleTextActive]}>Calendário</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, showHistory && styles.toggleButtonActive]}
          onPress={() => setShowHistory(true)}
        >
          <Text style={[styles.toggleText, showHistory && styles.toggleTextActive]}>Histórico</Text>
        </TouchableOpacity>
      </View>

      {!showHistory && (
        <View style={styles.calendarContainer}>
          <Calendar
            style={styles.calendar}
            hideExtraDays={false}
            staticHeader={true}
            onDayPress={day => {
              setSelected(day.dateString);
            }}
            markedDates={{
              [selected]: { selected: true, disableTouchEvent: true, selectedColor: '#fecc00ff', selectedTextColor: 'black' }
            }}
          />
        </View>
      )}
      
      <View style={styles.agendamentosSection}>
        <Text style={styles.titleAtendimentos}>
          {showHistory 
            ? 'Histórico de atendimentos' 
            : `Meus atendimentos${selected ? ` - ${selected.split('-').reverse().join('/')}` : ''}`
          }
        </Text>
        
        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#fecc00ff" />
            <Text style={{ marginTop: 10, color: '#666' }}>Carregando...</Text>
          </View>
        ) : agendamentos.length === 0 ? (
          <Text style={styles.textAtendimentos}>
            {showHistory 
              ? 'Você não possui histórico de atendimentos.' 
              : (selected 
                  ? 'Você não possui atendimento para esta data.' 
                  : 'Selecione uma data no calendário.')
            }
          </Text>
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
              <View style={styles.agendamentoItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.agendamentoTitle}>
                    {item.setor?.nome || 'Setor'} • {formatDateTime(item.data_hora)}
                  </Text>
                  <Text style={styles.agendamentoSub}>
                    {item.setor?.localiza || 'Localização não informada'}
                  </Text>
                  <Text style={{ 
                    marginTop: 5, 
                    fontSize: 12, 
                    fontWeight: '600',
                    color: getStatusColor(item.status)
                  }}>
                    Status: {getStatusText(item.status)}
                  </Text>
                </View>
                {item.status === 'pendente' && !showHistory && (
                  <TouchableOpacity 
                    onPress={() => cancelar(item.id)} 
                    style={styles.cancelButton}
                    disabled={loading}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

