import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTasksByTechId } from '../../lib/api/_tasks';
import { getUserById } from '../../lib/api/auth';
import { useRouter } from 'expo-router';
import Home from './tasks/home';
import TicketDashboard from './tickets/dashboard';
export default function HomeRedirector() {


  const router=useRouter();
  const [role,setRole]=useState('');


  useEffect(()=>{

    AsyncStorage.getItem('userRole').then((savedRole)=>{
      if (savedRole) {
        const upperRole = savedRole.toUpperCase();
        console.log('Loaded role:', upperRole); // ✅ log the correct value
        setRole(upperRole);
    }
    });
  },[])
 
  if(role==='TECHNICIAN'){
    return <Home/>
  }else{
    return <TicketDashboard/>
  }

 
}