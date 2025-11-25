import React, { useState, useEffect } from 'react';
import { View, Text, Image, useWindowDimensions, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import HeaderTed from '../../components/HeaderTed';
import styles from '../../styles/perfilStyles';

const PerfilScreen = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const avatarSize = Math.min(width * 0.7, 300);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Carregando...',
        ra: '...',
        email: '...',
        curso: 'Carregando...',
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError) {
                console.error('Erro de autenticação:', authError);
                await supabase.auth.signOut();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
                return;
            }
            
            if (user) {
                // Buscar dados completos da tabela aluno
                const { data: aluno, error } = await supabase
                    .from('aluno')
                    .select('*')
                    .eq('auth_user_id', user.id)
                    .single();

                if (error) {
                    console.error('Erro ao carregar dados do aluno:', error);
                    // Fallback para metadados se ainda não vinculado
                    setUserData({
                        name: user.user_metadata?.name || 'Nome não disponível',
                        ra: user.user_metadata?.ra || 'RA não disponível',
                        email: user.user_metadata?.email_institucional || user.email || 'Email não disponível',
                        curso: user.user_metadata?.curso || 'Engenharia de Software',
                    });
                } else if (aluno) {
                    setUserData({
                        name: aluno.nome,
                        ra: `a${aluno.RA}`, // Adiciona 'a' na frente do número
                        email: aluno.email,
                        curso: aluno.curso,
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

                        <Text style={styles.descText}>R.A</Text>
                        <Text style={styles.text}>{userData.ra}</Text>

                        <Text style={styles.descText}>E-mail</Text>
                        <Text style={styles.text}>{userData.email}</Text>

                        <Text style={styles.descText}>Curso</Text>
                        <Text style={styles.text}>{userData.curso}</Text>
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

export default PerfilScreen;