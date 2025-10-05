import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const PerfilScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.botImageContainer}>
                <Image
                    source={require('../../../assets/images/chatbot.png')}
                    style={styles.botImage}
                />
            </View>

            <View style={styles.perfilContainer}>
                <Image
                    source={require('../../../assets/images/perfil-blank.png')}
                    style={styles.perfilImage}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botImageContainer: {
        position: 'absolute',
        top: 40,
    },
    botImage: {
        width: 100,
        height: 100,
    },
    perfilContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    perfilImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    text: {
        fontSize: 20,
    },
});

export default PerfilScreen;