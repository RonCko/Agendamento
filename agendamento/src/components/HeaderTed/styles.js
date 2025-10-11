import { StyleSheet } from 'react-native';
import colors from '../../../colors/colors';

export default StyleSheet.create({
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
    color: colors.secondary,
    marginBottom: 2,
  },
  textTed: {
    fontSize: 16,
    textAlign: 'left',
    color: '#555',
  },
  imageTed: {
    marginLeft: 8,
    resizeMode: 'contain',
  },
});
