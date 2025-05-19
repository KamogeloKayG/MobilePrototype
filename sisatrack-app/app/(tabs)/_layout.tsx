import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('userRole').then((savedRole) => {
      if (savedRole) setRole(savedRole.toLowerCase());
    });
  }, []);

  if (!role) return null; // wait until role is loaded

  return (
    <Tabs
      screenOptions={{
        headerTitle: () => null,
        headerLeft: () => (
          <View style={styles.logoContainer}>
            <View style={styles.logoSquare}></View>
            <Text style={styles.logoText}>SISATRACK</Text>
          </View>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity style={styles.headerButton}>
              <View style={styles.iconCircle}>
                <Ionicons name="notifications-outline" size={20} color="#333" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-outline" size={20} color="#333" />
              </View>
            </TouchableOpacity>
          </View>
        ),
        headerStyle: {
          backgroundColor: '#f9f9f9',
        },
        headerShadowVisible: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {role === 'TECHNICIAN' && (
        <Tabs.Screen
          name="tasks/(home)"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
          }}
        />
      )}

      {role === 'CLIENT' && (
        <Tabs.Screen
          name="tickets/index"
          options={{
            title: 'Tickets',
            tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
          }}
        />
      )}

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  logoSquare: {
    width: 24,
    height: 24,
    backgroundColor: '#FFD700',
    marginRight: 10,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFD700',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  headerButton: {
    marginLeft: 16,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
