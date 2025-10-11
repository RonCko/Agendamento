import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderTed from '../../components/HeaderTed';
import styles from './styles';

const PerfilScreen = () => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const avatarSize = Math.min(width * 0.7, 300);
    return (
        <SafeAreaView style={styles.container} edges={['top','left','right']}>
            <HeaderTed />
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
                    <Text style={styles.text}>Fulano da Silva</Text>

                    <Text style={styles.descText}>R.A</Text>
                    <Text style={styles.text}>a2508915</Text>

                    <Text style={styles.descText}>E-mail</Text>
                    <Text style={styles.text}>fulano@exemplo.com</Text>

                    <Text style={styles.descText}>Curso</Text>
                    <Text style={styles.text}>Engenharia de Software</Text>
                </View>
            </View>
    </SafeAreaView>
    );
};

export default PerfilScreen;