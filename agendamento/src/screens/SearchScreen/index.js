import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderTed from '../../components/HeaderTed';
import styles from './styles';

const SECTORES = [
    { id: 'deped', name: 'DEPED', bloco: 'A', sala: '101' },
    { id: 'dipati', name: 'DIPATI', bloco: 'B', sala: '202' },
    { id: 'cogeti', name: 'COGETI', bloco: 'C', sala: '303' },
    { id: 'nuape', name: 'NUAPE', bloco: 'D', sala: '404' },
];

const popularShortcuts = ['DEPED', 'NUAPE'];

const SearchScreen = () => {
    const navigation = useNavigation();
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return SECTORES;
        return SECTORES.filter((s) => s.name.toLowerCase().includes(q));
    }, [query]);

    function openAgendamento(sector) {
        navigation.navigate('AgendamentoScreen', { sector });
    }

        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <HeaderTed />
                <View style={[styles.header, styles.pagePad]}>
                    <Text style={styles.title}>Buscar setores</Text>
                    <Text style={styles.headerSubtitle}>Encontre e agende atendimento nos setores</Text>
                </View>

                <View style={[styles.shortcutsRow, styles.pagePad]}>
                    {popularShortcuts.map((label) => {
                        const sector = SECTORES.find((s) => s.name === label);
                        return (
                            <TouchableOpacity
                                key={label}
                                style={styles.shortcut}
                                onPress={() => openAgendamento(sector)}
                            >
                                <Text style={styles.shortcutText}>{label}</Text>
                            </TouchableOpacity>
                        );
                    })}
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

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => openAgendamento(item)}
                        >
                            <View style={styles.cardLeft}>
                                <View style={styles.avatar}><Text style={styles.avatarText}>{item.name[0]}</Text></View>
                            </View>
                            <View style={styles.cardBody}>
                                <Text style={styles.itemTitle}>{item.name}</Text>
                                <Text style={styles.itemSubtitle}>Bloco {item.bloco} • Sala {item.sala}</Text>
                            </View>
                            <View style={styles.cardRight}>
                                <Text style={styles.chevron}>›</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.empty}><Text>Nenhum setor encontrado</Text></View>
                    )}
                />
            </SafeAreaView>
        );
};


export default SearchScreen;