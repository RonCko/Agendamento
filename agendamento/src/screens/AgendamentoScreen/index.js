import React, { useMemo, useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../lib/supabase';
import HeaderTed from '../../components/HeaderTed';
import styles from './styles';

const SLOT_ROW_HEIGHT = 64;
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

const AgendamentoScreen = () => {
    const route = useRoute();
    const sector = route.params?.sector;
    const navigation = useNavigation();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [date, setDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [occupiedSlots, setOccupiedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alunoId, setAlunoId] = useState(null);

    const allSlots = useMemo(() => generateSlots(7, 23, 30), []);

    useEffect(() => {
        loadUserSession();
    }, []);

    useEffect(() => {
        if (date && sector && alunoId) {
            fetchOccupiedSlots();
        }
    }, [date, sector, alunoId]);

    async function loadUserSession() {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email) {
            // Buscar o ID do aluno na tabela aluno usando o email
            const { data, error } = await supabase
                .from('aluno')
                .select('id')
                .eq('email', session.user.email)
                .single();
            
            if (data && !error) {
                setAlunoId(data.id);
            } else {
                console.error('Erro ao buscar ID do aluno:', error);
            }
        }
    }

    async function fetchOccupiedSlots() {
        if (!date || !sector?.id || !alunoId) return;

        try {
            setLoading(true);
            const dateStr = formatDateKey(date);
            
            // Buscar agendamentos ATIVOS do dia para o setor específico (excluir cancelados)
            const { data: sectorSlots, error: sectorError } = await supabase
                .from('agendamento')
                .select('data_hora')
                .eq('setor_id', sector.id)
                .neq('status', 'cancelado')
                .gte('data_hora', `${dateStr} 00:00:00`)
                .lte('data_hora', `${dateStr} 23:59:59`);

            if (sectorError) {
                console.error('Erro ao buscar agendamentos do setor:', sectorError);
                return;
            }

            // Buscar agendamentos ATIVOS do aluno para o dia (em qualquer setor, excluir cancelados)
            const { data: userSlots, error: userError } = await supabase
                .from('agendamento')
                .select('data_hora')
                .eq('aluno_id', alunoId)
                .neq('status', 'cancelado')
                .gte('data_hora', `${dateStr} 00:00:00`)
                .lte('data_hora', `${dateStr} 23:59:59`);

            if (userError) {
                console.error('Erro ao buscar agendamentos do aluno:', userError);
                return;
            }

            // Combinar horários ocupados do setor e do usuário
            const allOccupied = [...(sectorSlots || []), ...(userSlots || [])];
            
            // Extrair os horários ocupados e remover duplicatas
            const occupied = [...new Set(allOccupied.map(item => {
                const datetime = new Date(item.data_hora);
                const hour = String(datetime.getHours()).padStart(2, '0');
                const minute = String(datetime.getMinutes()).padStart(2, '0');
                return `${hour}:${minute}`;
            }))];

            setOccupiedSlots(occupied);
        } catch (error) {
            console.error('Erro ao buscar horários ocupados:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatDateKey(d) {
        if (!d) return '';
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function formatDateForDisplay(d) {
        if (!d) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatDateTimeToLocal(date, hour, minute) {
        // Cria timestamp no formato YYYY-MM-DD HH:MM:SS sem conversão UTC
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hourStr = String(hour).padStart(2, '0');
        const minuteStr = String(minute).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hourStr}:${minuteStr}:00`;
    }

    const availableSlots = useMemo(() => {
        if (!date) return [];
        return allSlots.filter((s) => !occupiedSlots.includes(s));
    }, [allSlots, occupiedSlots, date]);

    async function confirm() {
        if (!date) return Alert.alert('Atenção', 'Selecione uma data');
        if (!selectedSlot) return Alert.alert('Atenção', 'Selecione um horário');
        if (!alunoId) return Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');

        // Validar se a data não é no passado
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            return Alert.alert('Atenção', 'Não é possível agendar em datas passadas.');
        }

        try {
            // Criar data_hora no formato timestamp LOCAL (sem conversão UTC)
            const [hour, minute] = selectedSlot.split(':');
            const dataHoraLocal = formatDateTimeToLocal(date, parseInt(hour), parseInt(minute));

            // VALIDAÇÃO EXTRA: Verificar se já existe agendamento duplicado (mesmo aluno, setor, data/hora)
            const { data: existingAgendamento, error: checkError } = await supabase
                .from('agendamento')
                .select('id')
                .eq('aluno_id', alunoId)
                .eq('setor_id', sector.id)
                .eq('data_hora', dataHoraLocal)
                .maybeSingle();

            if (checkError) {
                console.error('Erro ao verificar agendamento duplicado:', checkError);
            }

            if (existingAgendamento) {
                return Alert.alert(
                    'Agendamento Duplicado',
                    'Você já possui um agendamento neste horário e setor.'
                );
            }

            // Inserir agendamento no banco
            const { data, error } = await supabase
                .from('agendamento')
                .insert([{
                    aluno_id: alunoId,
                    setor_id: sector.id,
                    data_hora: dataHoraLocal,
                    status: 'pendente'
                }])
                .select();

            if (error) {
                console.error('Erro ao criar agendamento:', error);
                Alert.alert('Erro', 'Não foi possível criar o agendamento. Tente novamente.');
                return;
            }

            Alert.alert(
                'Sucesso!', 
                'Seu agendamento foi realizado com sucesso.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Tabs', { screen: 'HomeScreen' });
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Erro ao confirmar agendamento:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar o agendamento.');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderTed />
            <View style={styles.pagePad}>
                <Text style={styles.title}>Agendar Atendimento</Text>
                {sector ? (
                    <>
                        <Text style={styles.subtitleHeader}>{sector.nome}</Text>
                        {sector.localiza && (
                            <Text style={styles.subtitle}>{sector.localiza}</Text>
                        )}
                    </>
                ) : (
                    <Text style={styles.subtitle}>Nenhum setor selecionado</Text>
                )}

                <View style={{ marginTop: 16 }} />

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
                        minimumDate={new Date()}
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

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>Carregando horários...</Text>
                    </View>
                ) : !date ? (
                    <View style={styles.empty}>
                        <Text>Informe uma data para ver os horários livres.</Text>
                    </View>
                ) : availableSlots.length === 0 ? (
                    <View style={styles.empty}>
                        <Text>Não há horários livres para essa data.</Text>
                    </View>
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
                                        <Text style={selected ? styles.slotTextSelected : styles.slotText}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                )}

                <TouchableOpacity 
                    style={[styles.confirmButton, (!date || !selectedSlot) && styles.confirmButtonDisabled]} 
                    onPress={confirm}
                    disabled={!date || !selectedSlot}
                >
                    <Text style={styles.confirmText}>Confirmar agendamento</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};


export default AgendamentoScreen;