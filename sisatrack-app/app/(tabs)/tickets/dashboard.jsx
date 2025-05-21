import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function TicketDashboard() {
  const [role, setRole] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('User');
  const [ticketData,setTicketData] =useState([]);
  const ticketStats = {
    total: 10,
    open: 4,
    resolved: 5,
    pending: 1,
  };

  /*const recentTickets = [
    {
      id: 1,
      text: 'Ticket #2021 resolved - Printer issue',
      time: '1 hour ago',
      status: 'resolved',
    },
    {
      id: 2,
      text: 'New ticket submitted - Internet down',
      time: '3 hours ago',
      status: 'pending',
    },
    {
      id: 3,
      text: 'User reported login problem',
      time: 'Yesterday',
      status: 'pending',
    },
    {
      id: 4,
      text: 'Escalated: VPN not working',
      time: '2 days ago',
      status: 'resolved',
    },
  ];*/

  useEffect(() => {
    const fetchTickets = async () => {
      const savedRole = await AsyncStorage.getItem('userRole');
      if (savedRole) setRole(savedRole.toLowerCase());
  
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);
  
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
  
      console.log('About to fetch data');
  

      
        const userID = await AsyncStorage.getItem('userID');
        if (!userID) return;
  
        try {
          const res = await fetch(`http://localhost:8080/api/tickets/client/${1}`);
          if (!res.ok) throw new Error('Failed to fetch ticket data');
          const data = await res.json();
          console.log('New ticket:', data);
          setTicketData(data);
          await AsyncStorage.setItem('ticketData', JSON.stringify(data));
        } catch (error) {
          console.error(error);
        }
    
        try {
          const parsed = JSON.parse(cachedData);
          setTicketData(parsed);
        } catch (e) {
          console.error('Failed to parse cached ticketData:', e);
        }
      
    };
  
    fetchTickets();
  }, []);
  
  const router = useRouter();

const handleTicketPress = (ticketID) => {
  router.push(`/tickets/${ticketID}`);
  
};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Ticket Stats */}
      <View style={styles.statBlocksContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.statBlock, { backgroundColor: '#FFD700' }]}>
            <View style={styles.statContent}>
              <Ionicons name="document-text-outline" size={24} color="#333" />
              <Text style={styles.statValue}>{ticketStats.total}</Text>
              <Text style={styles.statLabel}>Total Tickets</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statBlock, { backgroundColor: '#4dabf7' }]}>
            <View style={styles.statContent}>
              <Ionicons name="time-outline" size={24} color="#333" />
              <Text style={styles.statValue}>{ticketStats.open}</Text>
              <Text style={styles.statLabel}>Open</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.statBlock, { backgroundColor: '#40c057' }]}>
            <View style={styles.statContent}>
              <Ionicons name="checkmark-done-outline" size={24} color="#333" />
              <Text style={styles.statValue}>{ticketStats.resolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statBlock, { backgroundColor: '#ff922b' }]}>
            <View style={styles.statContent}>
              <Ionicons name="pause-circle-outline" size={24} color="#333" />
              <Text style={styles.statValue}>{ticketStats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.createButtonContainer}>
  <TouchableOpacity
    onPress={() => router.push('/tickets/CreateTicket')} 
    style={styles.createButton}
  >
    <Ionicons name="add-circle-outline" size={20} color="#fff" />
    <Text style={styles.createButtonText}>Create Ticket</Text>
  </TouchableOpacity>
</View>

      {/* Recent Ticket Activity */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Tickets</Text>
        {ticketData&&ticketData.map((ticket) => (
          
          <TouchableOpacity
            key={ticket.ticketID}
            onPress={() => handleTicketPress(ticket.ticketID)}
            style={styles.activityItem}
          >
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{ticket.title}</Text>
              <Text style={styles.activityTime}>{ticket.dateCreated}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusText,
                  {
                    backgroundColor:
                      ticket.status === 'resolved' ? '#40c057' : '#fa5252',
                  },
                ]}
              >
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    paddingTop: 15,
  },
  greeting: {
    fontSize: 16,
    color: '#757575',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  statBlocksContainer: {
    padding: 20,
    paddingTop: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBlock: {
    width: '48%',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#212121',
  },
  recentActivityContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4dabf7',
    marginRight: 10,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusContainer: {
    marginLeft: 10,
  },
  statusText: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    textAlign: 'center',
  },createButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  
}
);
