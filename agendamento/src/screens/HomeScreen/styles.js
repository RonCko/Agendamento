import { StyleSheet } from "react-native";
import colors from '../../../colors/colors';

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 0,
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#fecc00ff',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#000',
  },
  calendarContainer: {
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
    marginBottom: 16,
  },
  agendamentosSection: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  titleAtendimentos: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'left',
    color: colors.text,
  },
  textAtendimentos: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.placeholder,
    marginBottom: 2,
  },
  agendamentoItem: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  agendamentoTitle: { fontWeight: '700', color: '#111' },
  agendamentoSub: { color: '#666', marginTop: 2 },
  cancelButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#ffecec' },
  cancelText: { color: '#c0392b', fontWeight: '700' },
});

export default styles;