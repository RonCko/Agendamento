import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
                <View style={styles.header}>
                    <Text style={styles.title}>Buscar setores</Text>
                    <Text style={styles.headerSubtitle}>Encontre e agende atendimento nos setores</Text>
                </View>

                <View style={styles.shortcutsRow}>
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

                <View style={styles.searchBar}>
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
                    contentContainerStyle={{ paddingBottom: 32 }}
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

const styles = StyleSheet.create({
        container: { flex: 1, padding: 16, backgroundColor: '#fff' },
        header: { marginBottom: 8 },
        title: { fontSize: 22, fontWeight: '700' },
        headerSubtitle: { color: '#666', marginTop: 4 },
        shortcutsRow: { flexDirection: 'row', marginVertical: 12 },
        shortcut: {
            backgroundColor: '#eef6ff',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 24,
            marginRight: 10,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 1,
        },
        shortcutText: { color: '#1a73e8', fontWeight: '700' },
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f6f9ff',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: Platform.OS === 'ios' ? 10 : 6,
            marginBottom: 12,
        },
        searchIcon: { marginRight: 8, fontSize: 18 },
        input: { flex: 1, fontSize: 16, color: '#111' },
        card: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
        },
        cardLeft: { marginRight: 12 },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#e6f0ff',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
        },
        avatarText: { fontWeight: '700', color: '#1a73e8' },
        cardBody: { flex: 1 },
        itemTitle: { fontSize: 16, fontWeight: '700' },
        itemSubtitle: { color: '#666', marginTop: 4 },
        cardRight: { alignItems: 'flex-end' },
        chevron: { fontSize: 22, color: '#ccc' },
        empty: { padding: 24, alignItems: 'center' },
});

export default SearchScreen;