import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

interface NavItem {
    label: string;
    icon: any;
    route: string;
}

interface BottomTabBarProps {
    items: NavItem[];
    pathname: string;
    onNavigate: (route: string) => void;
}

export const BottomTabBar = React.memo(({ items, pathname, onNavigate }: BottomTabBarProps) => {
    const isActive = (route: string) => {
        if (route === '/(main)/') return pathname === '/' || pathname === '/index' || pathname === '';
        return pathname.includes(route.replace('/(main)', ''));
    };

    return (
        <View style={styles.bottomTabContainer}>
            <View style={styles.bottomTabBar}>
                {items.map((item) => {
                    const active = isActive(item.route);
                    const iconName = active
                        ? item.icon.replace('-outline', '')
                        : item.icon;

                    const tabLabel = item.label.includes('Home') ? 'Alfred' : item.label;

                    return (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.tabItem}
                            onPress={() => onNavigate(item.route)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={iconName}
                                size={22}
                                color={active ? '#34A853' : '#A1A1AA'}
                            />
                            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                                {tabLabel}
                            </Text>
                            {active && <View style={styles.tabIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});

export default BottomTabBar;
