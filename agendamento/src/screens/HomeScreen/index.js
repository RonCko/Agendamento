import React, {useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default function HomeScreen() {
  const [selected, setSelected] = useState(''); //state pra armazenar a data do calendário selecionada

  return (
    
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.textContainer}>
         <Text style={styles.help}>Precisa de ajuda?</Text>
         <Text style={styles.ted}>Clique aqui e fale com o Ted</Text>
        </View>
        <Image
          source={require('../../../assets/images/chatbot.png')}
          style={styles.logo}
        />
      </View>
  
      
      <View style={styles.calendario}> 
        <Calendar //Calendário básico com seleção da data
        hideExtraDays={false}
        staticHeader={true}
           onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedColor: '#fecc00ff', selectedTextColor: 'black' }
      }}
        
        />
      </View>

      <View style={styles.atendimentosContainer}>
        <Text style={styles.textAtendimentos}>Meus atendimentos</Text>
        <Text style={styles.titleAtendimentos}>Você não possui atendimento para esta data.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  help: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  ted: {
    textAlign: 'left',
    fontSize: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginLeft: 16,
    resizeMode: 'contain',
  },
  calendario: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
  },
  help: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ted: {
    fontSize: 20,
    textAlign: 'center',
  },
    atendimentosContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'absolute',
      bottom: 40,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
    },
  textAtendimentos: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: '#888',
  },
  titleAtendimentos: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },

});