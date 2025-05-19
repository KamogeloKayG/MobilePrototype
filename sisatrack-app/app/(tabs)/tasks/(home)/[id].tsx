import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

    type task = {
    id: number;
    title: string;
    company: string;
    priority: 'High' | 'Medium' | 'Low';
    location: string;
    date: Date;
    status: 'Pending' | 'In Progress' | 'Completed';
    };

  const tasks: task[] = [
  {
    id: 1,
    title: 'Fix Wi-Fi Router',
    company: 'SisaTech Ltd',
    priority: 'High',
    location: 'Midrand, Johannesburg',
    date: new Date('2025-05-18'),
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Install CCTV System',
    company: 'Greenline Security',
    priority: 'Medium',
    location: 'Soweto, Johannesburg',
    date: new Date('2025-05-19'),
    status: 'Pending',
  },
  {
    id: 3,
    title: 'Server Maintenance',
    company: 'NetCore Solutions',
    priority: 'Low',
    location: 'Randburg, Johannesburg',
    date: new Date('2025-05-20'),
    status: 'Pending',
  },
  {
    id: 4,
    title: 'Network Upgrade',
    company: 'SisaNet',
    priority: 'High',
    location: 'Sandton, Johannesburg',
    date: new Date('2025-05-21'),
    status: 'Pending',
  },
];

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const taskId = parseInt(id as string, 10);
  
  // Find the task by ID
  const task = tasks.find(t => t.id === taskId);
  
  // If task not found
  if (!task) {
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
    switch (task.priority) {
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
    switch (task.status) {
      case 'Completed':
        return '#28a745';
      case 'In Progress':
        return '#6c63ff'; // --button-secondary from web
      case 'Pending':
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
          <Text style={styles.taskId}>Task #{task.id}</Text>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>
        <View style={styles.taskStatus}>
          <View style={[styles.statusPill, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
        </View>
      </View>

      {/* Basic Information Card */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardTitleText}>Basic Information</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Company</Text>
              <Text style={styles.fieldValue}>{task.company}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Service Type</Text>
              <Text style={styles.fieldValue}>Service</Text>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Description</Text>
            <Text style={styles.fieldValue}>description</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Location</Text>
              <Text style={styles.fieldValue}>{task.location}</Text>
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
              <Text style={styles.fieldValue}>client</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Contact Number</Text>
              <Text style={styles.fieldValue}>client contact</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Technical Information Card */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardTitleText}>Technical Information</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.techInfo}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Assigned To</Text>
              <Text style={styles.fieldValue}>name</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Priority</Text>
              <Text style={[styles.priorityBadge, { color: getPriorityColor() }]}>
                {task.priority}
              </Text>
            </View>
          </View>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Created Date</Text>
              <Text style={styles.fieldValue}>{(task.date).toString()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {task.status === 'Pending' && (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleStartTask}>
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.btnText}>Start Task</Text>
          </TouchableOpacity>
        )}
        {task.status === 'In Progress' && (
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

      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Last updated: May 18, 2025</Text>
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
    color: '#495057',
  },
  cardContent: {
    padding: 15,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  field: {
    flex: 1,
    marginBottom: 12,
  },
  fieldLabel: {
    fontWeight: '600',
    marginBottom: 2,
    color: '#495057',
    fontSize: 13,
  },
  fieldValue: {
    color: '#333',
    fontSize: 14,
  },
  techInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    fontWeight: '500',
    fontSize: 14,
  },
  actionButtons: {
    padding: 16,
    flexDirection: 'column',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: '#343a40',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnSecondary: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  btnSecondaryText: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 14,
  },
  btnOutlineText: {
    color: '#343a40',
    fontWeight: '500',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#343a40',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
  },
});