import { StyleSheet, Dimensions } from "react-native";
import colors from '../../../colors/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
        // Ted agora é renderizado via HeaderTed reutilizável
    perfilContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 24,
    },
    perfilImage: {
        aspectRatio: 1,
        resizeMode: 'cover',
        maxWidth: 300,
    },
    textContainer: {
        flex: 5,
        alignItems: 'center',
    },
    infoCard: {
        width: '90%',
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    descText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        marginTop: 12,
        letterSpacing: 0.2,
        textTransform: 'uppercase',
    },
    text: {
        fontSize: 18,
        color: colors.text,
        marginTop: 4,
        marginBottom: 4,
        lineHeight: 24,
    },
});
export default styles;