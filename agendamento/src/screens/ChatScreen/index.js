import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import styles from './styles';
import colors from '../../../colors/colors';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [setores, setSetores] = useState([]);
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadSetores();
    addBotMessage('Olá! 👋 Sou o Ted Bot, seu assistente virtual da UTFPR.\n\nPosso ajudar você a encontrar setores e localizações no campus. Como posso ajudar?');
    
    // Listeners do teclado
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  async function loadSetores() {
    try {
      const { data, error } = await supabase
        .from('setor')
        .select('*')
        .order('nome');
      
      if (!error && data) {
        setSetores(data);
      }
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
    }
  }

  function addBotMessage(text, options = null) {
    const newMessage = {
      id: Date.now().toString(),
      type: 'bot',
      text,
      options,
      avatar: require('../../../assets/images/chatbot.png'),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => scrollToEnd(), 100);
  }

  function addUserMessage(text) {
    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setTimeout(() => scrollToEnd(), 100);
  }

  function scrollToEnd() {
    flatListRef.current?.scrollToEnd({ animated: true });
  }

  function processMessage(text) {
    const lowerText = text.toLowerCase().trim();
    
    // Buscar setor específico
    const setorEncontrado = setores.find(s => 
      s.nome.toLowerCase().includes(lowerText) || 
      lowerText.includes(s.nome.toLowerCase())
    );

    if (setorEncontrado) {
      addUserMessage(text);
      setTimeout(() => {
        addBotMessage(
          `📍 ${setorEncontrado.nome}\n\n` +
          `📌 Localização: ${setorEncontrado.localiza}\n\n` +
          (setorEncontrado.descricao ? `ℹ️ ${setorEncontrado.descricao}\n\n` : '') +
          `Posso ajudar com mais alguma coisa?`
        );
      }, 500);
      return;
    }

    // Palavras-chave genéricas
    if (lowerText.includes('oi') || lowerText.includes('olá') || lowerText.includes('ola')) {
      addUserMessage(text);
      setTimeout(() => {
        addBotMessage('Olá! Como posso ajudar você hoje? 😊');
      }, 500);
      return;
    }

    if (lowerText.includes('obrigad') || lowerText.includes('valeu')) {
      addUserMessage(text);
      setTimeout(() => {
        addBotMessage('Por nada! Estou sempre aqui para ajudar. 😊');
      }, 500);
      return;
    }

    if (lowerText.includes('onde') || lowerText.includes('local') || lowerText.includes('fica')) {
      addUserMessage(text);
      setTimeout(() => {
        addBotMessage('Você pode me perguntar sobre qualquer setor! Exemplos:\n\n• DERAC\n• Biblioteca\n• Secretaria\n\nOu clique nos botões abaixo para ver todos os setores.');
      }, 500);
      return;
    }

    // Mensagem padrão se não entender
    addUserMessage(text);
    setTimeout(() => {
      addBotMessage('Desculpe, não entendi sua pergunta. 😅\n\nTente perguntar sobre algum setor específico ou use os botões de opções rápidas!');
    }, 500);
  }

  function handleQuickOption(option) {
    setShowQuickOptions(false);
    
    switch (option) {
      case 'todos_setores':
        addUserMessage('Ver todos os setores');
        setTimeout(() => {
          const listaSetores = setores.map(s => `• ${s.nome}`).join('\n');
          addBotMessage(
            `Aqui estão todos os setores disponíveis:\n\n${listaSetores}\n\n` +
            `Digite o nome de qualquer setor para ver sua localização!`
          );
        }, 500);
        break;
      
      case 'mais_procurados':
        addUserMessage('Setores mais procurados');
        setTimeout(() => {
          addBotMessage(
            '🔥 Setores mais procurados:\n\n' +
            '• DERAC (Departamento de Registros Acadêmicos)\n' +
            '• Biblioteca\n' +
            '• Secretaria\n' +
            '• DAE (Departamento de Assuntos Estudantis)\n\n' +
            'Digite o nome de algum para saber a localização!'
          );
        }, 500);
        break;
      
      case 'ajuda':
        addUserMessage('Como usar o Ted Bot?');
        setTimeout(() => {
          addBotMessage(
            '💡 Como usar:\n\n' +
            '1. Digite o nome de um setor\n' +
            '2. Use palavras como "onde fica" + nome do setor\n' +
            '3. Clique nos botões de opções rápidas\n\n' +
            'Exemplos:\n• "DERAC"\n• "Onde fica a biblioteca?"\n• "Localização da secretaria"'
          );
        }, 500);
        break;
    }
    
    setTimeout(() => setShowQuickOptions(true), 1000);
  }

  function handleSend() {
    if (!input.trim()) return;
    processMessage(input);
  }

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
          ref={flatListRef}
          contentContainerStyle={styles.listContent}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />

        {/* Opções Rápidas - Oculta quando teclado está visível */}
        {showQuickOptions && messages.length > 0 && !isKeyboardVisible && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickOptionsContainer}
          >
            <TouchableOpacity 
              style={styles.quickOption}
              onPress={() => handleQuickOption('todos_setores')}
            >
              <Text style={styles.quickOptionText}>📋 Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickOption}
              onPress={() => handleQuickOption('mais_procurados')}
            >
              <Text style={styles.quickOptionText}>🔥 Populares</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickOption}
              onPress={() => handleQuickOption('ajuda')}
            >
              <Text style={styles.quickOptionText}>❓ Ajuda</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome de um setor..."
            placeholderTextColor={colors.placeholder}
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
