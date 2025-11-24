import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './styles';
import HeaderTed from '../../components/HeaderTed';
import { supabase } from '../../lib/supabase';

export default function AgendamentosListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { status } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    loadAgendamentos();
  }, []);

  async function loadAgendamentos() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('agendamento')
        .select(`
          id,
          data_hora,
          status,
          aluno_id,
          setor_id,
          aluno (
            id,
            nome,
            RA
          ),
          setor (
            id,
            nome,
            localiza
          )
        `)
        .eq('status', status)
        .order('data_hora', { ascending: true });

      if (error) {
        console.error('Erro ao carregar agendamentos:', error);
        setAgendamentos([]);
      } else {
        setAgendamentos(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
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

  function getStatusInfo() {
    const statusConfig = {
      pendente: { label: 'Pendentes', color: '#FFA500', icon: 'time-outline' },
      confirmado: { label: 'Confirmados', color: '#4CAF50', icon: 'checkmark-circle-outline' },
      concluido: { label: 'Concluídos', color: '#2196F3', icon: 'checkmark-done-outline' },
      cancelado: { label: 'Cancelados', color: '#F44336', icon: 'close-circle-outline' }
    };
    return statusConfig[status] || { label: status, color: '#666', icon: 'ellipse' };
  }

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HeaderTed />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Ionicons name={statusInfo.icon} size={20} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{statusInfo.label}</Text>
            <Text style={styles.subtitle}>{agendamentos.length} agendamentos</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fecc00ff" />
          <Text style={styles.loadingText}>Carregando agendamentos...</Text>
        </View>
      ) : agendamentos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum agendamento {statusInfo.label.toLowerCase()}</Text>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderLeftColor: statusInfo.color }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.alunoNome}>{item.aluno?.nome}</Text>
                <Text style={styles.alunoRA}>RA: {item.aluno?.RA}</Text>
              </View>
              
              <View style={styles.cardDivider} />
              
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Ionicons name="business-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{item.setor?.nome}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{item.setor?.localiza}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{formatDateTime(item.data_hora)}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
