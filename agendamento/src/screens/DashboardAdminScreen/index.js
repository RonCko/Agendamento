import React, { useState, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import HeaderTed from '../../components/HeaderTed';
import { supabase } from '../../lib/supabase';

export default function DashboardAdminScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    pendentes: 0,
    confirmados: 0,
    concluidos: 0,
    cancelados: 0,
    hoje: 0,
  });
  const [setorStats, setSetorStats] = useState([]);
  const [expandedSetor, setExpandedSetor] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  async function loadDashboardData() {
    try {
      setLoading(true);
      await Promise.all([
        loadStatusStats(),
        loadSetorStats(),
      ]);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStatusStats() {
    try {
      // Buscar totais por status
      const { data: allAgendamentos, error } = await supabase
        .from('agendamento')
        .select('id, status, data_hora');

      if (error) throw error;

      const hoje = new Date().toISOString().split('T')[0];
      
      const statusCount = {
        pendentes: 0,
        confirmados: 0,
        concluidos: 0,
        cancelados: 0,
        hoje: 0,
      };

      allAgendamentos?.forEach(item => {
        const dataAgendamento = item.data_hora.split('T')[0];
        
        if (dataAgendamento === hoje) {
          statusCount.hoje++;
        }
        
        switch (item.status) {
          case 'pendente':
            statusCount.pendentes++;
            break;
          case 'confirmado':
            statusCount.confirmados++;
            break;
          case 'concluido':
            statusCount.concluidos++;
            break;
          case 'cancelado':
            statusCount.cancelados++;
            break;
        }
      });

      setStats(statusCount);
    } catch (error) {
      console.error('Erro ao carregar estatísticas de status:', error);
    }
  }

  async function loadSetorStats() {
    try {
      const { data, error } = await supabase
        .from('agendamento')
        .select(`
          id,
          setor_id,
          status,
          setor (
            id,
            nome
          )
        `);

      if (error) throw error;

      // Agrupar por setor
      const setorMap = {};
      data?.forEach(item => {
        const setorNome = item.setor?.nome || 'Sem setor';
        if (!setorMap[setorNome]) {
          setorMap[setorNome] = {
            nome: setorNome,
            total: 0,
            pendentes: 0,
            confirmados: 0,
            concluidos: 0,
            cancelados: 0,
          };
        }
        setorMap[setorNome].total++;
        
        switch (item.status) {
          case 'pendente':
            setorMap[setorNome].pendentes++;
            break;
          case 'confirmado':
            setorMap[setorNome].confirmados++;
            break;
          case 'concluido':
            setorMap[setorNome].concluidos++;
            break;
          case 'cancelado':
            setorMap[setorNome].cancelados++;
            break;
        }
      });

      const setorArray = Object.values(setorMap).sort((a, b) => b.total - a.total);
      setSetorStats(setorArray);
    } catch (error) {
      console.error('Erro ao carregar estatísticas de setor:', error);
    }
  }

  function calcularTaxaCancelamento() {
    const total = stats.pendentes + stats.confirmados + stats.concluidos + stats.cancelados;
    if (total === 0) return 0;
    return ((stats.cancelados / total) * 100).toFixed(1);
  }

  function navigateToAgendamentos(status) {
    navigation.navigate('AgendamentosListScreen', { status });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HeaderTed />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadDashboardData}
            colors={['#fecc00ff']}
            tintColor="#fecc00ff"
          />
        }
      >
        <Text style={styles.pageTitle}>Dashboard</Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fecc00ff" />
            <Text style={styles.loadingText}>Carregando estatísticas...</Text>
          </View>
        )}

        {!loading && (
          <>
            {/* Cards de Status - CLICÁVEIS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visão Geral</Text>
              <View style={styles.cardsRow}>
                <TouchableOpacity 
                  style={[styles.card, styles.cardPendente]}
                  onPress={() => navigateToAgendamentos('pendente')}
                >
                  <Ionicons name="time-outline" size={28} color="#FFA500" />
                  <Text style={styles.cardNumber}>{stats.pendentes}</Text>
                  <Text style={styles.cardLabel}>Pendentes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.card, styles.cardConfirmado]}
                  onPress={() => navigateToAgendamentos('confirmado')}
                >
                  <Ionicons name="checkmark-circle-outline" size={28} color="#4CAF50" />
                  <Text style={styles.cardNumber}>{stats.confirmados}</Text>
                  <Text style={styles.cardLabel}>Confirmados</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardsRow}>
                <TouchableOpacity 
                  style={[styles.card, styles.cardConcluido]}
                  onPress={() => navigateToAgendamentos('concluido')}
                >
                  <Ionicons name="checkmark-done-outline" size={28} color="#2196F3" />
                  <Text style={styles.cardNumber}>{stats.concluidos}</Text>
                  <Text style={styles.cardLabel}>Concluídos</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.card, styles.cardCancelado]}
                  onPress={() => navigateToAgendamentos('cancelado')}
                >
                  <Ionicons name="close-circle-outline" size={28} color="#F44336" />
                  <Text style={styles.cardNumber}>{stats.cancelados}</Text>
                  <Text style={styles.cardLabel}>Cancelados</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Card Hoje */}
            <View style={styles.section}>
              <View style={[styles.cardWide, styles.cardHoje]}>
                <Ionicons name="calendar-outline" size={32} color="#000" />
                <View style={styles.cardWideContent}>
                  <Text style={styles.cardWideNumber}>{stats.hoje}</Text>
                  <Text style={styles.cardWideLabel}>Agendamentos Hoje</Text>
                </View>
              </View>
            </View>

            {/* Taxa de Cancelamento */}
            <View style={styles.section}>
              <View style={[styles.cardWide, styles.cardTaxa]}>
                <Ionicons name="trending-down-outline" size={32} color="#F44336" />
                <View style={styles.cardWideContent}>
                  <Text style={styles.cardWideNumber}>{calcularTaxaCancelamento()}%</Text>
                  <Text style={styles.cardWideLabel}>Taxa de Cancelamento</Text>
                </View>
              </View>
            </View>

            {/* Estatísticas por Setor - REDESENHADO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Agendamentos por Setor</Text>
              {setorStats.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum agendamento registrado</Text>
              ) : (
                setorStats.map((setor, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.setorCardNew}
                    onPress={() => setExpandedSetor(expandedSetor === index ? null : index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.setorHeaderNew}>
                      <View style={styles.setorIconContainer}>
                        <Text style={styles.setorIcon}>🏢</Text>
                      </View>
                      <View style={styles.setorInfo}>
                        <Text style={styles.setorNomeNew}>{setor.nome}</Text>
                        <Text style={styles.setorTotalNew}>{setor.total} agendamentos</Text>
                      </View>
                      <Ionicons 
                        name={expandedSetor === index ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color="#666" 
                      />
                    </View>
                    
                    {expandedSetor === index && (
                      <View style={styles.setorStatsNew}>
                        <View style={styles.statRow}>
                          <View style={[styles.statDot, { backgroundColor: '#FFA500' }]} />
                          <Text style={styles.statLabel}>Pendentes</Text>
                          <Text style={styles.statValue}>{setor.pendentes}</Text>
                        </View>
                        <View style={styles.statRow}>
                          <View style={[styles.statDot, { backgroundColor: '#4CAF50' }]} />
                          <Text style={styles.statLabel}>Confirmados</Text>
                          <Text style={styles.statValue}>{setor.confirmados}</Text>
                        </View>
                        <View style={styles.statRow}>
                          <View style={[styles.statDot, { backgroundColor: '#2196F3' }]} />
                          <Text style={styles.statLabel}>Concluídos</Text>
                          <Text style={styles.statValue}>{setor.concluidos}</Text>
                        </View>
                        <View style={styles.statRow}>
                          <View style={[styles.statDot, { backgroundColor: '#F44336' }]} />
                          <Text style={styles.statLabel}>Cancelados</Text>
                          <Text style={styles.statValue}>{setor.cancelados}</Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
