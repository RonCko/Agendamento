import { StyleSheet } from 'react-native';
import colors from '../../../colors/colors';



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    pagePad: { paddingHorizontal: 16 },
    title: { fontSize: 18, fontWeight: '700' },
    subtitleHeader: { fontSize: 20, fontWeight: '800', marginTop: 6 },
    subtitle: { color: colors.textSecondary, marginBottom: 12 },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
    slotsContainer: {
        // altura fixa para mostrar 3 linhas e permitir scroll
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: colors.background
    },
    slot: {
        flex: 1,
        margin: 6,
        height: 48,
        borderRadius: 24,
        borderWidth: 0,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    slotSelected: { backgroundColor: colors.primary, borderColor: colors.border },
    slotText: { color: colors.textSecondary, fontWeight: '700' },
    slotTextSelected: { color: colors.text, fontWeight: '700' },
    confirmButton: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    confirmButtonDisabled: {
        backgroundColor: colors.textSecondary + '40',
        opacity: 0.6,
    },
    confirmText: { color: colors.text, fontWeight: '700' },
    empty: { padding: 24, alignItems: 'center' },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: colors.textSecondary,
    },
});

export default styles;