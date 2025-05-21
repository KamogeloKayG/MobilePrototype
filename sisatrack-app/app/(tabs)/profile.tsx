import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '../../lib/api/auth';
import { useNavigation, CommonActions } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    role: 'TECHNICIAN',
    jobTitle: 'Senior Technician',
    employeeId: 'T-1234',
    specialization: 'HVAC Systems',
    joinDate: 'March 2022'
  });
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadUserInfo();
  }, []);
  
  const loadUserInfo = async () => {
    try {
      setIsLoading(true);
      
      // Get userId from AsyncStorage
      const userID = await AsyncStorage.getItem('userID');
      
      if (!userID) {
        console.error('User ID not found in AsyncStorage');
        setIsLoading(false);
        return;
      }
      
      // Fetch user data from API
      const userData = await getUserById(parseInt(userID));
      
      // Update user information with API data
      setUserInfo(prev => ({
        ...prev,
        name: `${userData.name} ${userData.surname}`,
        email: userData.email,
        phone: userData.phoneNumber || prev.phone,
        role: userData.role,
        // Keep other fields from previous state if not provided by API
      }));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user info:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load profile information');
    }
  };
  
  const handleLogout = async () => {
    // Alert.alert(
    //   'Logout',
    //   'Are you sure you want to logout?',
    //   [
    //     { text: 'Cancel', style: 'cancel' },
    //     { 
    //       text: 'Logout', 
    //       style: 'destructive',
    //       onPress: async () => {
            try {
              // Clear user session data
              await AsyncStorage.multiRemove(['userID', 'userRole']);
              
              // Navigate to login screen using CommonActions
              // This approach bypasses TypeScript navigation typing issues
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'login' as any }], // Replace 'Login' with your actual login screen name
                })
              );
              
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
    //       }
    //     }
    //   ]
    // );
  };
  
  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Alert.alert('Edit Profile', 'This would open the edit profile form');
  };
  
  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This would open the change password form');
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };
  
  const toggleDarkMode = () => {
    setDarkModeEnabled(prev => !prev);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInitials}>
          <Text style={styles.initialsText}>
            {userInfo.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userInfo.name}</Text>
          <Text style={styles.profileRole}>{userInfo.jobTitle}</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>{userInfo.role}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#757575" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userInfo.email}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#757575" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{userInfo.phone}</Text>
        </View>
      </View>
      
      {/* Work Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Information</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="id-card-outline" size={20} color="#757575" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Employee ID</Text>
          <Text style={styles.infoValue}>{userInfo.employeeId}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="construct-outline" size={20} color="#757575" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Specialization</Text>
          <Text style={styles.infoValue}>{userInfo.specialization}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color="#757575" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Joined</Text>
          <Text style={styles.infoValue}>{userInfo.joinDate}</Text>
        </View>
      </View>
      
      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={20} color="#757575" />
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            trackColor={{ false: '#e0e0e0', true: '#FFD70066' }}
            thumbColor={notificationsEnabled ? '#FFD700' : '#f4f3f4'}
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Ionicons name="moon-outline" size={20} color="#757575" />
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            trackColor={{ false: '#e0e0e0', true: '#FFD70066' }}
            thumbColor={darkModeEnabled ? '#FFD700' : '#f4f3f4'}
            onValueChange={toggleDarkMode}
            value={darkModeEnabled}
          />
        </View>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <Ionicons name="lock-closed-outline" size={20} color="#757575" />
          <Text style={styles.menuItemText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
      </View>
      
      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={20} color="#757575" />
          <Text style={styles.menuItemText}>About SISATRACK</Text>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={20} color="#757575" />
          <Text style={styles.menuItemText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={20} color="#757575" />
          <Text style={styles.menuItemText}>Terms & Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#f44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      {/* App Version */}
      <Text style={styles.versionText}>SISATRACK v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileInitials: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  initialsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  profileRole: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  profileBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  profileBadgeText: {
    fontSize: 10,
    color: '#424242',
    fontWeight: '500',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#757575',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#212121',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#212121',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 16,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#f44336',
  },
  versionText: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#9e9e9e',
    fontSize: 12,
  },
});