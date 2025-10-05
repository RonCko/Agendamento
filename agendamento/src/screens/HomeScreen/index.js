import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default function HomeScreen() {
  const [selected, setSelected] = useState(''); //state pra armazenar a data do calendário selecionada

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.textHelp}>Precisa de ajuda?</Text>
          <Text style={styles.textTed}>Clique aqui e fale com o Ted</Text>
        </View>
        <Image
          source={require('../../../assets/images/chatbot.png')}
          style={styles.imageTed}
        />
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          hideExtraDays={false}
          staticHeader={true}
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: { selected: true, disableTouchEvent: true, selectedColor: '#fecc00ff', selectedTextColor: 'black' }
          }}
        />
        <View style={styles.textContainerCustom}>
          <Text style={styles.titleAtendimentos}>Meus atendimentos</Text>
          <Text style={styles.textAtendimentos}>Você não possui atendimento para esta data.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 40,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  textHelp: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  textTed: {
    fontSize: 16,
    textAlign: 'left',
    color: '#555',
  },
  calendarContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  imageTed: {
    width: Dimensions.get('window').width * 0.18,
    height: Dimensions.get('window').width * 0.18,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  calendar: {
    width: '100%',
    alignSelf: 'stretch',
    minWidth: '100%',
    maxWidth: '100%',
    marginBottom: 24,
  },
  textContainerCustom: {
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  textAtendimentos: {
    fontSize: 15,
    textAlign: 'center',
    color: '#888',
    marginBottom: 2,
  },
  titleAtendimentos: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: '#222',
  },

});