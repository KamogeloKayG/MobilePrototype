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

// Define the Task type
type Task = {
  id: number;
  title: string;
  company: string;
  priority: 'High' | 'Medium' | 'Low';
  location: string;
  date: Date;
  status: 'Open' | 'In Progress' | 'Completed';
};

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('User');
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  // Task statistics derived from actual tasks
  const [taskStats, setTaskStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    new: 0
  });
  
  // Recent activities will be derived from tasks later
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, text: 'Work order #1234 completed', time: '2 hours ago' },
    { id: 2, text: 'New task assigned: Air conditioning repair', time: '4 hours ago' },
    { id: 3, text: 'Replaced server cooling unit at DataCorp', time: '1 day ago' },
    { id: 4, text: 'Received parts for pending repair job', time: '2 days ago' },
  ]);

  // Load user data and tasks
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get user ID and role from AsyncStorage
        const userID = await AsyncStorage.getItem('userID');
        const userRole = await AsyncStorage.getItem('userRole');
        
        if (userRole) {
          setRole(userRole.toLowerCase());
        }
        
        if (userID) {
          // Fetch user data to get the name
          const userData = await getUserById(parseInt(userID));
          if (userData) {
            setUserName(`${userData.name} ${userData.surname}`);
          }
          
          // Fetch tasks assigned to this technician
          const technicianTasksData = await getTasksByTechId(parseInt(userID));
          
          // Convert API response to match our Task type
          const convertedTasks = technicianTasksData.map((task: any) => ({
            id: task.taskID,
            title: task.ticket.title,
            company: task.ticket.client.companyName,
            priority: task.ticket.priority,
            location: task.ticket.client.location || "N/A",
            date: new Date(task.assignedDate),
            status: task.status,
          }));
          
          setTasks(convertedTasks);
          
          // Calculate task statistics
          const stats = {
            total: convertedTasks.length,
            inProgress: convertedTasks.filter(task => task.status === 'In Progress').length,
            completed: convertedTasks.filter(task => task.status === 'Completed').length,
            new: convertedTasks.filter(task => task.status === 'Open').length
          };
          setTaskStats(stats);
          
          // Find the first task with "In Progress" status to display as current
          const inProgressTask = convertedTasks.find(task => task.status === 'In Progress');
          setCurrentTask(inProgressTask || null);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    setGreeting(greeting);
  }, []);

  // Format date for display
  const formatTaskDate = (date: Date) => {
    const taskDate = new Date(date);
    const today = new Date();
    
    // Check if task is today
    if (taskDate.toDateString() === today.toDateString()) {
      return `Today, ${taskDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if task is tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (taskDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${taskDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show full date
    return taskDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
           `, ${taskDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Stat Blocks */}
      <View style={styles.statBlocksContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.statBlock, { backgroundColor: '#FFD700' }]}>
            <View style={styles.statContent}>
              <Ionicons name="layers-outline" size={24} color="#333" />
              <Text style={styles.statValue}>{taskStats.total}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statBlock, { backgroundColor: '#4dabf7' }]}>
            <View style={styles.statContent}>
              <Ionicons name="sync-outline" size={24} color="#333" />
              <Text style={styles.statValue}>{taskStats.inProgress}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.statBlock, { backgroundColor: '#40c057' }]}>
            <View style={styles.statContent}>
              <Ionicons name="checkmark-done-outline" size={24} color="#333" />
              <Text style={styles.statValue}>{taskStats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statBlock, { backgroundColor: '#ff922b' }]}>
            <View style={styles.statContent}>
              <Ionicons name="add-circle-outline" size={24} color="#333" />
              <Text style={styles.statValue}>{taskStats.new}</Text>
              <Text style={styles.statLabel}>New Tasks</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekly Activity */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>Task Activity Chart</Text>
          <Text style={styles.chartPlaceholderSubText}>Mon - Sun</Text>
          <View style={styles.mockChartLine}>
            <View style={[styles.mockChartPoint, { bottom: 10, left: '10%' }]} />
            <View style={[styles.mockChartPoint, { bottom: 40, left: '25%' }]} />
            <View style={[styles.mockChartPoint, { bottom: 20, left: '40%' }]} />
            <View style={[styles.mockChartPoint, { bottom: 60, left: '55%' }]} />
            <View style={[styles.mockChartPoint, { bottom: 45, left: '70%' }]} />
            <View style={[styles.mockChartPoint, { bottom: 30, left: '85%' }]} />
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivities.map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{activity.text}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Current Task */}
      <View style={styles.upcomingTasksContainer}>
        <Text style={styles.sectionTitle}>Current Task</Text>
        {currentTask ? (
          <View style={styles.upcomingTaskItem}>
            <View style={styles.upcomingTaskIconContainer}>
              <Ionicons name="build-outline" size={20} color="#fff" />
            </View>
            <View style={styles.upcomingTaskContent}>
              <Text style={styles.upcomingTaskTitle}>
                {currentTask.title} at {currentTask.company}
              </Text>
              <Text style={styles.upcomingTaskTime}>
                {formatTaskDate(currentTask.date)}
              </Text>
              <View style={styles.taskDetailsRow}>
                <View style={[styles.priorityBadge, 
                  currentTask.priority === 'High' ? styles.highPriority : 
                  currentTask.priority === 'Medium' ? styles.mediumPriority : 
                  styles.lowPriority
                ]}>
                  <Text style={styles.priorityText}>{currentTask.priority}</Text>
                </View>
                <Text style={styles.locationText}>
                  <Ionicons name="location-outline" size={12} color="#757575" /> {currentTask.location}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#757575" />
          </View>
        ) : (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No tasks in progress</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
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
  chartContainer: {
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
  chartPlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#616161',
  },
  chartPlaceholderSubText: {
    fontSize: 12,
    color: '#9e9e9e',
    marginTop: 5,
  },
  mockChartLine: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#FFD700',
    borderRadius: 1,
  },
  mockChartPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
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
    alignItems: 'flex-start',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginTop: 5,
    marginRight: 10,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#212121',
  },
  activityTime: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  upcomingTasksContainer: {
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
  upcomingTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  upcomingTaskIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4dabf7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingTaskContent: {
    flex: 1,
  },
  upcomingTaskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  upcomingTaskTime: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  taskDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  highPriority: {
    backgroundColor: '#ffcdd2',
  },
  mediumPriority: {
    backgroundColor: '#fff9c4',
  },
  lowPriority: {
    backgroundColor: '#c8e6c9',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 10,
    color: '#757575',
  },
  noTasksContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noTasksText: {
    color: '#757575',
    fontSize: 14,
  }
});