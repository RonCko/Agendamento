import { StyleSheet } from 'react-native';
import colors from '../../../colors/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPendente: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  cardConfirmado: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cardConcluido: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  cardCancelado: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  cardWide: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHoje: {
    borderLeftWidth: 4,
    borderLeftColor: '#fecc00ff',
  },
  cardTaxa: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  cardWideContent: {
    flex: 1,
  },
  cardWideNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardWideLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  setorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  setorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  setorNome: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  setorTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fecc00ff',
  },
  setorStats: {
    gap: 8,
  },
  setorStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setorStatDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  setorStatText: {
    fontSize: 13,
    color: '#666',
  },
  horarioCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  horarioRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fecc00ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horarioRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  horarioContent: {
    flex: 1,
  },
  horarioHora: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  horarioCount: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  setorCardNew: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  setorHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  setorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fecc00ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setorIcon: {
    fontSize: 24,
  },
  setorInfo: {
    flex: 1,
  },
  setorNomeNew: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  setorTotalNew: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  setorStatsNew: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});

export default styles;
