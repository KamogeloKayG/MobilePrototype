import TaskCard from '@/components/taskCard';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getTasksByTechId } from '../../../lib/api/_tasks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

type task = {
  id: number;
  title: string;
  company: string;
  priority: 'High' | 'Medium' | 'Low';
  location: string;
  date: Date;
  status: 'Open' | 'In Progress' | 'Completed';
};

export default function Tasks() {
  const [tasks, setTasks] = useState<task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Open' | 'Completed'>('Open');

  const fetchTasks = useCallback(async () => {
    try {
      // Get user ID from AsyncStorage
      const userID = await AsyncStorage.getItem('userID');
      // Use the actual userID or fallback to 2 if not available
      const userId = userID ? parseInt(userID) : 2;
      
      const tasksFromApi = await getTasksByTechId(userId);
      const converted = tasksFromApi.map((task: any) => ({
        id: task.taskID,
        title: task.ticket.title,
        company: task.ticket.client.companyName,
        priority: task.ticket.priority,
        location: "N/A", 
        date: new Date(task.assignedDate),
        status: task.status,
      }));
      
      setTasks(converted);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Fetch tasks when the screen comes into focus (returning from another screen)
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const openTasks = tasks.filter(task => task.status !== 'Completed');
  const completedTasks = tasks.filter(task => task.status === 'Completed');
  const filteredTasks = activeTab === 'Open' ? openTasks : completedTasks;

  return (
    <View style={styles.container}>
      {/* Tasks Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.title}>Tasks</Text>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Open' && styles.activeTab]} 
          onPress={() => setActiveTab('Open')}
        >
          <Text style={[styles.tabText, activeTab === 'Open' && styles.activeTabText]}>
            Open({openTasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]} 
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>
            Completed({completedTasks.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <ScrollView style={styles.taskList}>
        {error && (
          <Text style={styles.errorText}>Error loading tasks: {error}</Text>
        )}
        {filteredTasks.length === 0 ? (
          <Text style={styles.noTasksText}>No {activeTab.toLowerCase()} tasks found</Text>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const colors = {
  primary: '#424242', // Professional dark gray (from web version)
  secondary: '#757575', // Medium gray for accents
  background: '#F5F7FA', // Light gray background
  surface: '#FFFFFF', // White surface
  text: {
    primary: '#212121', // Dark gray for primary text
    secondary: '#616161', // Medium gray for secondary text
    light: '#FFFFFF', // White text
  },
  border: '#E0E0E0', // Light border color
  success: '#4CAF50', // Green for success states
  warning: '#FF9800', // Orange for warning states
  error: '#F44336', // Red for error states
  disabled: '#BDBDBD', // Disabled state color
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleBar: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  taskList: {
    flex: 1,
    padding: 12,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.error,
    fontSize: 16,
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.text.secondary,
    fontSize: 16,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  taskCardHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  taskDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  taskContent: {
    flexDirection: 'row',
    padding: 16,
  },
  taskInfoContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  taskDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  square: {
    width: 12,
    height: 12,
    backgroundColor: colors.primary,
    marginRight: 10,
    borderRadius: 2,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statusContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  statusPill: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  }
});