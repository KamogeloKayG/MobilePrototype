import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type TaskCardProps = {
  id: number;
  title: string;
  company: string;
  priority: 'High' | 'Medium' | 'Low';
  location: string;
  date: Date;
  status: 'Open' | 'In Progress' | 'Completed';
};

export default function TaskCard({ id, title, company, priority, location, date, status }: TaskCardProps) {
  const router = useRouter();

  // Get priority color
  const getPriorityColor = () => {
    switch (priority) {
      case 'High':
        return '#dc3545'; // Red for high priority
      case 'Medium':
        return '#ffc107'; // Yellow for medium priority
      case 'Low':
        return '#28a745'; // Green for low priority
      default:
        return '#6c757d'; // Gray as fallback
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'Completed':
        return '#28a745'; // Green for completed
      case 'In Progress':
        return '#6c63ff'; // Purple for in progress
      case 'Open':
        return '#6c757d'; // Gray for pending
      default:
        return '#6c757d';
    }
  };

  // Format date to display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle card press to navigate to details
  const handlePress = () => {
    router.push({
      pathname: "/tasks/[id]",
      params: { id: id.toString() }
    });
  };

  return (
    <TouchableOpacity style={styles.taskCard} onPress={handlePress}>
      <View style={styles.taskCardHeader}>
        <Text style={styles.taskDate}>{formatDate(date)}</Text>
      </View>
      <View style={styles.taskContent}>
        <View style={styles.taskInfoContainer}>
          <Text style={styles.taskTitle}>{title}</Text>
          <View style={styles.taskDetails}>
            <View style={styles.detailRow}>
              <View style={[styles.square, { backgroundColor: getPriorityColor() }]} />
              <Text style={styles.detailText}>{company}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color="#666" style={{ marginRight: 8 }} />
              <Text style={styles.detailText}>{location}</Text>
            </View>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusPill, { backgroundColor: getStatusColor() }]}>
            <Text style={[styles.statusText, { color: '#FFFFFF' }]}>{status}</Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="#666" 
            style={{ marginTop: 12 }} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  taskCardHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  taskDate: {
    fontSize: 14,
    color: '#666',
  },
  taskContent: {
    flexDirection: 'row',
    padding: 12,
  },
  taskInfoContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#343a40',
  },
  taskDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  square: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  }
});