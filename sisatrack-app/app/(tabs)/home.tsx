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

<<<<<<< HEAD
  const router=useRouter();
  const [role,setRole]=useState('');
  useEffect(() => {
    AsyncStorage.getItem('userRole').then((savedRole) => {
      if (savedRole) {
        const upperRole = savedRole.toUpperCase();
        console.log('Loaded role:', upperRole); // ✅ log the correct value
        setRole(upperRole);
      }
    });
=======
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
  
  // This is where audit of tasks will be shown
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, text: 'Assigned a new Task', time: '2 hours ago' },
  ]);

  // Helper function to compare if two objects are equal
  const areTasksEqual = (tasks1: Task[], tasks2: Task[]) => {
    if (tasks1.length !== tasks2.length) return false;
    return tasks1.every((task1, index) => {
      const task2 = tasks2[index];
      return task1.id === task2.id && 
             task1.status === task2.status && 
             task1.title === task2.title &&
             task1.company === task2.company;
    });
  };

  const areStatsEqual = (stats1: any, stats2: any) => {
    return stats1.total === stats2.total &&
           stats1.inProgress === stats2.inProgress &&
           stats1.completed === stats2.completed &&
           stats1.new === stats2.new;
  };

  // Load user data and tasks
  const loadData = async () => {
    try {
      // Only show loading indicator on initial load
      if (tasks.length === 0) {
        setIsLoading(true);
      }
      
      // Get user ID and role from AsyncStorage
      const userID = await AsyncStorage.getItem('userID');
      const userRole = await AsyncStorage.getItem('userRole');
      
      if (userRole && role !== userRole.toLowerCase()) {
        setRole(userRole.toLowerCase());
      }
      
      if (userID) {
        // Fetch user data to get the name (only on initial load)
        if (userName === 'User') {
          const userData = await getUserById(parseInt(userID));
          if (userData) {
            setUserName(`${userData.name} ${userData.surname}`);
          }
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
        
        // Only update tasks if they've actually changed
        if (!areTasksEqual(tasks, convertedTasks)) {
          setTasks(convertedTasks);
        }
        
        // Calculate task statistics
        const stats = {
          total: convertedTasks.length,
          inProgress: convertedTasks.filter(task => task.status === 'In Progress').length,
          completed: convertedTasks.filter(task => task.status === 'Completed').length,
          new: convertedTasks.filter(task => task.status === 'Open').length
        };
        
        // Only update stats if they've changed
        if (!areStatsEqual(taskStats, stats)) {
          setTaskStats(stats);
        }
        
        // Find the first task with "In Progress" status to display as current
        const inProgressTask = convertedTasks.find(task => task.status === 'In Progress');
        const currentTaskChanged = 
          (!currentTask && inProgressTask) || 
          (currentTask && !inProgressTask) ||
          (currentTask && inProgressTask && currentTask.id !== inProgressTask.id);
        
        if (currentTaskChanged) {
          setCurrentTask(inProgressTask || null);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadData();
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    setGreeting(greeting);
    
    // Set up interval for regular refreshes (every 30 seconds)
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
>>>>>>> 78bae91dee513fe494f665a464594413378b9cc4
  }, []);

  if(role==='TECHNICIAN'){
    return <Home/>
  }else{
    return <TicketDashboard/>
  }
  

}