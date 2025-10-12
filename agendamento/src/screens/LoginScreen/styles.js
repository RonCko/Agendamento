import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../colors/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 0,
    paddingHorizontal: 16,
  },
  flex: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    aspectRatio: 2,
    height: undefined,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  input: {
    width: '90%',
    maxWidth: 420,
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
  },
  button: {
    width: '90%',
    maxWidth: 420,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotButton: {
    alignSelf: 'center',
    marginBottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: '100%',
    alignItems: 'center',
  },
  forgotButtonText: {
    color: colors.text,
    fontSize: 16,
  },
});

export default styles;