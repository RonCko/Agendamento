import { StyleSheet, Dimensions } from "react-native";
import colors from '../../../colors/colors';

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.background,
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

export default styles;