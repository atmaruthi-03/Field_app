import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import styles from './styles';

interface ProfilePopoverProps {
    visible: boolean;
    onClose: () => void;
    user: any;
    onLogout: () => void;
}

function formatRole(role: string): string {
    return role
        ? role.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'Field Engineer';
}

export const ProfilePopover = React.memo(({ visible, onClose, user, onLogout }: ProfilePopoverProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.popoverContainer}>
                            <View style={styles.popoverHeader}>
                                <View style={styles.popoverAvatar}>
                                    <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
                                </View>
                                <View>
                                    <Text style={styles.popoverName}>{user?.name ?? 'User'}</Text>
                                    <Text style={styles.popoverRole}>{formatRole(user?.role)}</Text>
                                </View>
                            </View>

                            <View style={styles.popoverDivider} />

                            <TouchableOpacity style={styles.popoverItem} onPress={onLogout}>
                                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                                <Text style={[styles.popoverItemText, styles.logoutText]}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

export default ProfilePopover;
