import React from 'react';
import { View, Text, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function HeaderTed({ title = 'Precisa de ajuda?', subtitle = 'Clique aqui e fale com o Ted', onPressTed }) {
  const { width } = useWindowDimensions();
  const tedSize = Math.min(width * 0.18, 96);
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.textHelp}>{title}</Text>
        <Text style={styles.textTed}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        onPress={onPressTed || (() => navigation.navigate('Chat'))}
        accessibilityRole="button"
        accessibilityLabel="Abrir chat com o Ted"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../../assets/images/chatbot.png')}
          style={[styles.imageTed, { width: tedSize, height: tedSize }]}
        />
      </TouchableOpacity>
    </View>
  );
}
