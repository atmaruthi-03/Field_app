import { Platform, StatusBar as RNStatusBar, StyleSheet } from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 0;

export const styles: any = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E7',
        zIndex: 10,
    },
    headerInner: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarBtn: {
        padding: 2,
    },
    branding: {
        backgroundColor: '#34A853',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },
    brandText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    iconBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    bottomTabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E4E4E7',
        paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        paddingTop: 10,
        zIndex: 10,
    },
    bottomTabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
        paddingHorizontal: 12,
        flex: 1,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#A1A1AA',
        marginTop: 4,
    },
    tabLabelActive: {
        color: '#34A853',
        fontWeight: '700',
    },
    tabIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#34A853',
        position: 'absolute',
        top: -6,
    },
    // Popover Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'flex-start',
        paddingTop: STATUS_BAR_HEIGHT + 60,
        paddingLeft: 16,
    },
    popoverContainer: {
        width: 240,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#E4E4E7',
    },
    popoverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    popoverAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#09090B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#09090B',
    },
    popoverRole: {
        fontSize: 12,
        color: '#71717A',
    },
    popoverDivider: {
        height: 1,
        backgroundColor: '#F4F4F5',
        marginVertical: 4,
    },
    popoverItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
    },
    popoverItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3F3F46',
    },
    logoutText: {
        color: '#EF4444',
    },
});

export default styles;
