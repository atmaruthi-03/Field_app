import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GlobalHeader() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Left: Hamburger Menu */}
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="menu-outline" size={28} color="#1A1A1A" />
                </TouchableOpacity>

                {/* Center: Alfred Logo */}
                <Image
                    source={require('../assets/images/Alfred.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Right: Notifications & Profile */}
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, styles.profileButton]}>
                        <Ionicons name="person-circle-outline" size={28} color="#34A853" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    logo: {
        width: 100,
        height: 32,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        position: 'relative',
    },
    profileButton: {
        marginLeft: 4,
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
});
