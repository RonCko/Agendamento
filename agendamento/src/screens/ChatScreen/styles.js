import { StyleSheet } from 'react-native';
import colors from '../../../colors/colors';

const styles = StyleSheet.create({
  flex: { 
    flex: 1 
  },
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
  quickOptionsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  quickOption: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickOptionText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
  },
});

export default styles;
