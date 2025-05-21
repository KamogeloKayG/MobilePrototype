import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
  } from 'react-native';
  import { useRouter } from 'expo-router';
  import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const dummyTickets = [
    { id: 'T1', category: 'Support', status: 'Completed', dateOpened: '12/02/25' },
    { id: 'T2', category: 'Maintenance', status: 'Resolved', dateOpened: '12/02/25' },
    { id: 'T3', category: 'Server Management', status: 'Unassigned', dateOpened: '12/02/25' },
    { id: 'T4', category: 'Support', status: 'In Progress', dateOpened: '12/02/25' },
  ];
  
  export default function TicketsScreen() {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const [ticketData, setTicketData] = useState([]);
    const [userID, setUserID] = useState(null);
    
    // First useEffect: Load userID from AsyncStorage
    useEffect(() => {
      const loadUserID = async () => {
        try {
          const storedID = await AsyncStorage.getItem('userID');
          if (storedID) {
            setUserID(storedID);
          }
        } catch (error) {
          console.error('Failed to load userID from storage:', error);
        }
      };
      loadUserID();
    }, []);

    // Second useEffect: Fetch tickets when userID changes
    useEffect(() => {
      if (userID) {
        console.log('Fetching tickets for userID:', userID);
        fetch(`http://localhost:8080/api/tickets/client/${userID}`)
          .then(res => {
            if (!res.ok) {
              throw new Error("Failed to fetch tickets");
            }
            return res.json();
          })
          .then(data => {
            console.log("Fetched tickets:", data);
            setTicketData(data);
          })
          .catch(error => {
            console.error('Error fetching tickets:', error);
          });
      }
    }, [userID]); // This effect runs when userID changes
  
    const renderItem = ({ item }) => (
      <View style={styles.row}>
        <Text style={styles.idCol}>{item.title}</Text>
        <Text style={styles.statusCol}>{item.status}</Text>
        <Text style={styles.dateCol}>{item.dateCreated}</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => router.push(`/tickets/${item.ticketID}`)}
        >
          <Text style={styles.buttonText}>View Ticket</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={styles.container}>
        {/* Filters Section */}
        <View style={styles.filters}>
          <TextInput
            placeholder="Search tickets..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.btnText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetBtn}>
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
        </View>
  
        {/* Tickets Table */}
        <FlatList
          data={ticketData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={() => (
            <View style={[styles.row, styles.header]}>
              <Text style={styles.idCol}>ID</Text>
              <Text style={styles.statusCol}>Status</Text>
              <Text style={styles.dateCol}>Date Opened</Text>
              <Text style={{ width: 80 }}></Text>
            </View>
          )}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fff',
      flex: 1,
    },
    filters: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
      gap: 8,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    searchInput: {
      flex: 1,
      minWidth: 100,
      padding: 10,
      borderRadius: 6,
      borderColor: '#ccc',
      borderWidth: 1,
      fontSize: 14,
    },
    searchBtn: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 6,
    },
    resetBtn: {
      backgroundColor: '#6c757d',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 6,
    },
    btnText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 13,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomColor: 'black',
      borderBottomWidth: 1,
    },
    header: {
      backgroundColor: '#f5f5f5',
      borderBottomWidth: 2,
      borderBottomColor: '#ccc',
    },
    idCol: {
      flex: 1,
      fontSize: 13,
      fontWeight: '500',
      color: '#333',
    },
    statusCol: {
      flex: 2,
      fontSize: 13,
      color: '#333',
    },
    dateCol: {
      flex: 2,
      fontSize: 13,
      color: '#333',
    },
    viewButton: {
      width: 80,
      backgroundColor: '#23272b',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 6,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 12,
    },
  });