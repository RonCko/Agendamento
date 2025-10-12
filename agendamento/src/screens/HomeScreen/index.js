import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import styles from './styles';
import HeaderTed from '../../components/HeaderTed';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [selected, setSelected] = useState(''); //state pra armazenar a data do calendário selecionada
  const [agendamentos, setAgendamentos] = useState([]);

  // carregar/agendar sempre que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const load = async () => {
        try {
          const raw = await AsyncStorage.getItem('AGENDAMENTOS');
          const arr = raw ? JSON.parse(raw) : [];
          if (isActive) setAgendamentos(arr);
        } catch (e) {
          console.error(e);
        }
      };
      load();
      return () => {
        isActive = false;
      };
    }, [])
  );

  async function cancelar(id) {
    try {
      const raw = await AsyncStorage.getItem('AGENDAMENTOS');
      const arr = raw ? JSON.parse(raw) : [];
      const filtered = arr.filter((a) => a.id !== id);
      await AsyncStorage.setItem('AGENDAMENTOS', JSON.stringify(filtered));
      setAgendamentos(filtered);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível cancelar o agendamento.');
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <HeaderTed />
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
        <View style={styles.textContainerCustom}>
          <Text style={styles.titleAtendimentos}>Meus atendimentos</Text>
          {agendamentos.length === 0 ? (
            <Text style={styles.textAtendimentos}>Você não possui atendimento para esta data.</Text>
          ) : (
            <FlatList
              data={agendamentos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.agendamentoItem}>
                  <View>
                    <Text style={styles.agendamentoTitle}>{item.sectorName} • {item.date} {item.time}</Text>
                    <Text style={styles.agendamentoSub}>Bloco {item.bloco} • Sala {item.sala}</Text>
                  </View>
                  <TouchableOpacity onPress={() => cancelar(item.id)} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

