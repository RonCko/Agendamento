import { StyleSheet } from 'react-native';
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
  toggleContainer: {
    flexDirection: 'row',
    width: '90%',
    maxWidth: 420,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: '700',
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signupButton: {
    alignSelf: 'center',
    padding: 10,
  },
  signupButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default styles;