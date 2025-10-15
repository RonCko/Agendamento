import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderTed from '../../components/HeaderTed';
import styles from './styles';

const SLOT_ROW_HEIGHT = 64; // altura aproximada de uma linha de slots
const VISIBLE_ROWS = 3;

function generateSlots(startHour = 7, endHour = 23, stepMinutes = 30) {
    const slots = [];
    for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += stepMinutes) {
            const hour = String(h).padStart(2, '0');
            const minute = String(m).padStart(2, '0');
            slots.push(`${hour}:${minute}`);
        }
    }
    return slots;
}

// Mock de horários ocupados por setor+data (chave: `${sectorId}_${date}`)
const MOCK_OCCUPIED = {
    // exemplo: para DEPED em 2025-10-15 alguns horários já estão ocupados
    'deped_2025-10-15': ['09:00', '10:30', '14:00', '18:30'],
    'nuape_2025-10-15': ['07:30', '08:00', '12:00'],
};

const AgendamentoScreen = () => {
    const route = useRoute();
    const sector = route.params?.sector;
    const navigation = useNavigation();
        const [selectedSlot, setSelectedSlot] = useState(null);
        const [date, setDate] = useState(null); // Date object
        const [showPicker, setShowPicker] = useState(false);

    const allSlots = useMemo(() => generateSlots(7, 23, 30), []);

        function formatDateKey(d) {
            if (!d) return '';
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        }

        // formata uma Date para exibição DD/MM/AAAA (apresentação somente)
        function formatDateForDisplay(d) {
            if (!d) return '';
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        }

        const occupiedSlots = useMemo(() => {
            if (!sector || !date) return [];
            const key = `${sector.id}_${formatDateKey(date)}`;
            return MOCK_OCCUPIED[key] || [];
        }, [sector, date]);

    const availableSlots = useMemo(() => {
        if (!date) return [];
        return allSlots.filter((s) => !occupiedSlots.includes(s));
    }, [allSlots, occupiedSlots, date]);

    function confirm() {
        if (!date) return Alert.alert('Selecione uma data');
        if (!selectedSlot) return Alert.alert('Selecione um horário');
        const agendamento = {
            id: `${sector?.id}_${formatDateKey(date)}_${selectedSlot}`,
            sectorId: sector?.id,
            sectorName: sector?.name,
            bloco: sector?.bloco,
            sala: sector?.sala,
            date: formatDateKey(date),
            time: selectedSlot,
        };

        // salvar em AsyncStorage e voltar para Home
        AsyncStorage.getItem('AGENDAMENTOS')
            .then((res) => {
                const arr = res ? JSON.parse(res) : [];
                arr.push(agendamento);
                return AsyncStorage.setItem('AGENDAMENTOS', JSON.stringify(arr));
            })
            .then(() => {
                Alert.alert('Agendamento salvo', 'Seu agendamento foi salvo com sucesso.');
                // navegar para a aba Home para ver o agendamento
                try {
                    navigation.navigate('HomeScreen');
                } catch (e) {
                    // fallback: nada
                }
            })
            .catch((err) => {
                console.error(err);
                Alert.alert('Erro', 'Não foi possível salvar o agendamento.');
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderTed />
            <View style={styles.pagePad}>
                <Text style={styles.title}>Agendar</Text>
                <Text style={styles.subtitleHeader}>{sector?.name || 'Setor'}</Text>
                <Text style={styles.subtitle}>Bloco {sector?.bloco} • Sala {sector?.sala}</Text>

                    <View style={{ marginTop: 8 }} />

                    <TouchableOpacity
                        style={[styles.input, { justifyContent: 'center' }]}
                        onPress={() => setShowPicker(true)}
                    >
                        <Text>{date ? formatDateForDisplay(date) : 'Selecionar data'}</Text>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selected) => {
                                setShowPicker(Platform.OS === 'ios');
                                if (selected) {
                                    setDate(selected);
                                    setSelectedSlot(null);
                                }
                            }}
                        />
                    )}

            <Text style={styles.sectionTitle}>Horários disponíveis</Text>

            {!date ? (
                <View style={styles.empty}><Text>Informe uma data para ver os horários livres.</Text></View>
            ) : availableSlots.length === 0 ? (
                <View style={styles.empty}><Text>Não há horários livres para essa data.</Text></View>
            ) : (
                <View style={[styles.slotsContainer, { height: SLOT_ROW_HEIGHT * VISIBLE_ROWS }]}>
                    <FlatList
                        data={availableSlots}
                        keyExtractor={(s) => s}
                        numColumns={3}
                        renderItem={({ item }) => {
                            const selected = item === selectedSlot;
                            return (
                                <TouchableOpacity
                                    onPress={() => setSelectedSlot(item)}
                                    style={[styles.slot, selected && styles.slotSelected]}
                                >
                                    <Text style={selected ? styles.slotTextSelected : styles.slotText}>{item}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            )}

            <TouchableOpacity style={styles.confirmButton} onPress={confirm}>
                <Text style={styles.confirmText}>Confirmar agendamento</Text>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
};



export default AgendamentoScreen;