import TaskCard from '@/components/taskCard';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { getTasksByTechId } from '../../../../lib/api/_tasks';

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

useEffect(() => {
  getTasksByTechId(12)
    .then((tasksFromApi) => {
      const converted = tasksFromApi.map((task: any) => ({
        id: task.taskID,
        title: task.description,
        company: task.ticket.client.companyName,
        priority: task.ticket.priority,
        location: "N/A", // or actual location if available
        date: new Date(task.assignedDate),
        status: task.status,
      }));
      setTasks(converted);
    })
    .catch((err) => setError(err.message));
}, []);

  return (
    <View style={styles.container}>
      {/* Tasks Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.title}>Tasks</Text>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={styles.tabText}>Open({tasks.length})</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>Completed</Text>
        </View>
      </View>
      
      {/* Task List */}
      <ScrollView style={styles.taskList}>
            {tasks.map((task) => (
        <TaskCard key={task.id} {...task} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  titleBar: {
    backgroundColor: '#b8b8b8',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  taskList: {
    flex: 1,
    padding: 8,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
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
    color: '#000',
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
    backgroundColor: '#666',
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
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#333',
  }
});