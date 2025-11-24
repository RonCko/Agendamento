import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Modal,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderTed from '../../components/HeaderTed';
import { supabase } from '../../lib/supabase';
import styles from './styles';

const SearchScreen = () => {
    const navigation = useNavigation();
    const [query, setQuery] = useState('');
    const [sectores, setSectores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSector, setSelectedSector] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchSectores();
    }, []);

    async function fetchSectores() {
        try {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('setor')
                .select('id, nome, localiza, telefone, email, descricao')
                .order('nome', { ascending: true });

            if (error) {
                console.error('Erro ao buscar setores:', error);
                return;
            }

            setSectores(data || []);
        } catch (error) {
            console.error('Erro ao buscar setores:', error);
        } finally {
            setLoading(false);
        }
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return sectores;
        return sectores.filter((s) => s.nome.toLowerCase().includes(q));
    }, [query, sectores]);

    function openSectorModal(sector) {
        setSelectedSector(sector);
        setModalVisible(true);
    }

    function closeModal() {
        setModalVisible(false);
        setSelectedSector(null);
    }

    function openAgendamento() {
        setModalVisible(false);
        navigation.navigate('AgendamentoScreen', { sector: selectedSector });
    }

        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <HeaderTed />
                <View style={[styles.header, styles.pagePad]}>
                    <Text style={styles.title}>Buscar setores</Text>
                    <Text style={styles.headerSubtitle}>Encontre e agende atendimento nos setores</Text>
                </View>

                <View style={[styles.searchBar, styles.pagePad]}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Procure por DEPED, DIPATI, COGETI, NUAPE..."
                        value={query}
                        onChangeText={setQuery}
                        placeholderTextColor="#777"
                    />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>Carregando setores...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => openSectorModal(item)}
                            >
                                <View style={styles.cardLeft}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{item.nome[0]}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardBody}>
                                    <Text style={styles.itemTitle}>{item.nome}</Text>
                                    {item.descricao ? (
                                        <Text style={styles.itemDescription} numberOfLines={2}>{item.descricao}</Text>
                                    ) : null}
                                    {item.localiza ? (
                                        <Text style={styles.itemSubtitle}>Localização: {item.localiza}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.cardRight}>
                                    <Text style={styles.chevron}>›</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>Nenhum setor encontrado</Text>
                                <TouchableOpacity 
                                    style={styles.reloadButton}
                                    onPress={fetchSectores}
                                >
                                    <Text style={styles.reloadButtonText}>Recarregar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <SafeAreaView style={styles.modalContent} edges={['bottom']}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.modalScrollContent}
                            >
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalAvatarLarge}>
                                        <Text style={styles.modalAvatarText}>
                                            {selectedSector?.nome[0]}
                                        </Text>
                                    </View>
                                    <Text style={styles.modalTitle}>{selectedSector?.nome}</Text>
                                </View>

                                <View style={styles.modalBody}>
                                    {selectedSector?.descricao ? (
                                        <View style={styles.modalSection}>
                                            <Text style={styles.modalSectionTitle}>Sobre o Setor</Text>
                                            <Text style={styles.modalText}>{selectedSector.descricao}</Text>
                                        </View>
                                    ) : null}

                                    {selectedSector?.localiza ? (
                                        <View style={styles.modalSection}>
                                            <Text style={styles.modalSectionTitle}>📍 Localização</Text>
                                            <Text style={styles.modalText}>{selectedSector.localiza}</Text>
                                        </View>
                                    ) : null}

                                    {selectedSector?.telefone ? (
                                        <View style={styles.modalSection}>
                                            <Text style={styles.modalSectionTitle}>📞 Telefone</Text>
                                            <Text style={styles.modalText}>{selectedSector.telefone}</Text>
                                        </View>
                                    ) : null}

                                    {selectedSector?.email ? (
                                        <View style={styles.modalSection}>
                                            <Text style={styles.modalSectionTitle}>📧 Email</Text>
                                            <Text style={styles.modalText}>{selectedSector.email}</Text>
                                        </View>
                                    ) : null}
                                </View>

                                <View style={styles.modalActions}>
                                    <TouchableOpacity 
                                        style={styles.modalButtonPrimary}
                                        onPress={openAgendamento}
                                    >
                                        <Text style={styles.modalButtonPrimaryText}>Agendar Atendimento</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={styles.modalButtonSecondary}
                                        onPress={closeModal}
                                    >
                                        <Text style={styles.modalButtonSecondaryText}>Fechar</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </SafeAreaView>
                    </View>
                </Modal>
            </SafeAreaView>
        );
};


export default SearchScreen;