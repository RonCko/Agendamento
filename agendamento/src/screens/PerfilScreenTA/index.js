import React, { useState, useEffect } from 'react';
import { View, Text, Image, useWindowDimensions, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import HeaderTed from '../../components/HeaderTed';
import styles from '../../styles/perfilStyles';

const PerfilScreenTA = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const avatarSize = Math.min(width * 0.7, 300);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Carregando...',
        email: '...',
        setor: 'Carregando...',
        localiza: '...',
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                // Buscar dados completos da tabela tec_adm com setor
                const { data: tecAdm, error } = await supabase
                    .from('tec_adm')
                    .select(`
                        *,
                        setor (
                            nome,
                            localiza
                        )
                    `)
                    .eq('auth_user_id', user.id)
                    .single();

                if (error) {
                    console.error('Erro ao carregar dados do TA:', error);
                    setUserData({
                        name: user.user_metadata?.name || 'Nome não disponível',
                        email: user.email || 'Email não disponível',
                        setor: 'Setor não disponível',
                        localiza: '...',
                    });
                } else if (tecAdm) {
                    setUserData({
                        name: tecAdm.nome,
                        email: tecAdm.email,
                        setor: tecAdm.setor?.nome || 'Setor não informado',
                        localiza: tecAdm.setor?.localiza || 'Localização não informada',
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const { error } = await supabase.auth.signOut();
                            if (error) throw error;
                            
                            // Navegar de volta para Login
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top','left','right']}>
            <HeaderTed />
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.perfilContainer}>
                    <Image
                        source={require('../../../assets/images/perfil-blank.png')}
                        style={[
                            styles.perfilImage,
                            { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }
                        ]}
                    />
                </View>

                <View style={styles.textContainer}>
                    <View style={styles.infoCard}>
                        <Text style={styles.descText}>Nome</Text>
                        <Text style={styles.text}>{userData.name}</Text>

                        <Text style={styles.descText}>E-mail</Text>
                        <Text style={styles.text}>{userData.email}</Text>

                        <Text style={styles.descText}>Setor</Text>
                        <Text style={styles.text}>{userData.setor}</Text>

                        <Text style={styles.descText}>Localização</Text>
                        <Text style={styles.text}>{userData.localiza}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
                        onPress={handleLogout}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.logoutButtonText}>Sair da conta</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PerfilScreenTA;
