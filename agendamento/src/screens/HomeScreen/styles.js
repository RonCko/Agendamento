import { StyleSheet, Dimensions } from "react-native";
import colors from '../../../colors/colors';

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 0,
  },
  calendarContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginBottom: 0,
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
  titleAtendimentos: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: colors.text,
  },
  textAtendimentos: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.placeholder,
    marginBottom: 2,
  },
  

});

export default styles;