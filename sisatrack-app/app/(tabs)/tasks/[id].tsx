import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTaskById } from '../../../lib/api/_tasks';
    type task = {
    id: number;
    title: string;
    company: string;
    priority: 'High' | 'Medium' | 'Low';
    description:string,
    location: string;
    date: Date;
    clientName:string,
    clientNumber:string,
    status: 'Open' | 'In Progress' | 'Completed';
    };



export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const taskId = parseInt(id as string, 10);
  const [_task, setTask] = useState<task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  


    useEffect(() => {
      const fetchTask = async () => {
        try {
          const data: any = await getTaskById(taskId); // 👈 avoid typing mismatch
          const converted = {
            id: data.taskID,
            title: data.ticket.title,
            description: data.ticket.description,
            clientName: data.ticket.client.name,
            clientNumber: data.ticket.client.phoneNumber,
            company: data.ticket?.client?.companyName ?? 'Unknown',
            priority: data.ticket?.priority ?? 'Low',
            location: 'N/A',
            date: new Date(data.assignedDate),
            status: data.status,
          };
          setTask(converted);
        } catch (err) {
          setError('Failed to load task.');
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }, []);

  
  // If task not found
  if (!_task) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Task not found</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get priority color
  const getPriorityColor = () => {
    switch (_task.priority) {
      case 'High':
        return '#dc3545'; // --priority-high from web
      case 'Medium':
        return '#ffc107'; // --priority-medium from web
      case 'Low':
        return '#28a745'; // --priority-low from web
      default:
        return '#6c757d';
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (_task.status) {
      case 'Completed':
        return '#28a745';
      case 'In Progress':
        return '#6c63ff'; // --button-secondary from web
      case 'Open':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const handleStartTask = () => {
    Alert.alert(
      "Start Task",
      "Are you sure you want to begin this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Start", onPress: () => Alert.alert("Task started!") }
      ]
    );
  };

  const handleCompleteTask = () => {
    Alert.alert(
      "Complete Task",
      "Mark this task as completed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Complete", onPress: () => Alert.alert("Task completed!") }
      ]
    );
  };

  

  return (
    <ScrollView style={styles.container}>
      {/* Task Header */}
      <View style={styles.taskHeader}>
        <View style={styles.taskIdTitle}>
          <Text style={styles.taskId}>Task #{_task.id}</Text>
          <Text style={styles.taskTitle}>{_task.title}</Text>
        </View>
        <View style={styles.taskStatus}>
          <View style={[styles.statusPill, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{_task.status}</Text>
          </View>
        </View>
      </View>

      {/* Basic Information Card */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardTitleText}>{_task.title}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Company</Text>
              <Text style={styles.fieldValue}>{_task.company}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Service Type</Text>
              <Text style={styles.fieldValue}>{_task.title} Service</Text>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Description</Text>
            <Text style={styles.fieldValue}>{_task.description}</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Location</Text>
              <Text style={styles.fieldValue}>N/A</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Task Type</Text>
              <Text style={styles.fieldValue}>type</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contact Information Card */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardTitleText}>Contact Information</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Contact Person</Text>
              <Text style={styles.fieldValue}>{_task.clientName}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Contact Number</Text>
              <Text style={styles.fieldValue}>{_task.clientNumber}</Text>
            </View>
          </View>
        </View>
      </View>


      <View style={styles.card}>
        <View style={styles.cardTitle}>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Created Date</Text>
              <Text style={styles.fieldValue}>
                {_task?.date.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {_task.status === 'Open' && (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleStartTask}>
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.btnText}>Start Task</Text>
          </TouchableOpacity>
        )}
        {_task.status === 'Open' && (
          <TouchableOpacity style={styles.btnSecondary} onPress={handleCompleteTask}>
            <Ionicons name="checkmark" size={16} color="#000000" />
            <Text style={styles.btnSecondaryText}>Complete Task</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btnOutline} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={16} color="#343a40" />
          <Text style={styles.btnOutlineText}>Back to Tasks</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
  taskHeader: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskIdTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  taskId: {
    fontWeight: '600',
    fontSize: 14,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
    cardTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343a40',
  },
  cardContent: {
    padding: 12,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  field: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343a40',
  },
  techInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  priorityBadge: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    gap: 10,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c63ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffc107',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#343a40',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnSecondaryText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  btnOutlineText: {
    color: '#343a40',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    backgroundColor: '#6c63ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
  },
});
