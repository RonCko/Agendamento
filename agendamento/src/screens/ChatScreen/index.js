import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../colors/colors';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');

  // Mensagens de exemplo: uma do bot e uma do usuário
  const messages = [
    {
      id: '1',
      type: 'bot',
      text: 'Olá, sou o Ted. Como posso ajudar você?',
      avatar: require('../../../assets/images/chatbot.png'),
    },
    {
      id: '2',
      type: 'user',
      text: 'Oi Ted! Quero saber meus atendimentos de hoje.',
    },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'bot') {
      return (
        <View style={styles.row}>
          <Image source={item.avatar} style={styles.avatar} />
          <View style={[styles.bubble, styles.bubbleBot]}>
            <Text style={styles.textBot}>{item.text}</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.row, styles.rowUser]}>
        <View style={[styles.bubble, styles.bubbleUser]}>
          <Text style={styles.textUser}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          contentContainerStyle={styles.listContent}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.placeholder}
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => {}}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    maxWidth: '90%',
  },
  rowUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  bubble: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  bubbleBot: {
    backgroundColor: colors.inputBackground,
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
  },
  textBot: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  textUser: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    marginRight: 8,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    fontWeight: '700',
    color: '#000',
  },
});
