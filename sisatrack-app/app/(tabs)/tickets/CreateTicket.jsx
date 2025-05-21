import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TroubleshootingFormScreen = () => {
  const [category, setCategory] = useState('');
  const [answers, setAnswers] = useState({});
  const [userDescription, setDescription] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [pickerOptions, setPickerOptions] = useState([]);
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerCallback, setPickerCallback] = useState(() => { });
  const [pressedIndex, setPressedIndex] = useState(null);
  const [userID,setUserID]=useState();

  const questions = {
    cctv: [
      'Are the cameras not powering on?',
      'Is the footage blurry, lagging, or frozen?',
      'Is the DVR/NVR device working properly?',
      'Are you seeing "No Signal" or black screen issues?',
      'Are cables loose, cut, or disconnected?',
      'Is the system not recording or missing footage?',
    ],
    biometrics: [
      'Is the fingerprint scanner failing to read fingerprints?',
      'Is the device not syncing with the central server?',
      'Are users unable to authenticate or log in?',
      'Is the biometric device unresponsive or frozen?',
      'Are there errors during registration of new users?',
      'Are logs not being captured or displayed on the dashboard?',
    ],
    servers: [
      'Is the server not booting or powering on?',
      'Are users unable to access shared resources or files?',
      'Is the server overheating or making unusual noises?',
      'Are you experiencing frequent crashes or restarts?',
      'Is the storage drive full or showing disk errors?',
      'Are network services (like DNS, DHCP, or VPN) not working?',
    ],
  };

  const showPicker = (options, title, callback) => {
    setPickerTitle(title);
    setPickerOptions(options);
    setPickerCallback(() => callback);
    setPickerVisible(true);
  };

  const handleCategorySelect = () => {
    showPicker(
      [
        { label: 'CCTV', value: 'cctv' },
        { label: 'Biometrics', value: 'biometrics' },
        { label: 'Servers', value: 'servers' },
      ],
      'Select Category',
      (value) => {
        setCategory(value);
        setAnswers({});
      }
    );
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const generateDiagnosticSummary = () => {
    // If no answers provided, don't generate a summary
    const hasAnswers = Object.keys(answers).length > 0;
    if (!hasAnswers) return '';

    // Generic opening based on category
    let summary = `DIAGNOSTIC SUMMARY FOR ${category.toUpperCase()} ISSUE:\n\n`;

    // Add problem indicators based on answers
    const problemIndicators = [];

    if (category === 'cctv') {
      if (answers[0] === 'yes') problemIndicators.push('Power supply or electrical issues');
      if (answers[1] === 'yes') problemIndicators.push('Camera configuration or bandwidth problems');
      if (answers[2] === 'no') problemIndicators.push('DVR/NVR malfunction');
      if (answers[3] === 'yes') problemIndicators.push('Connection or cable problems');
      if (answers[4] === 'yes') problemIndicators.push('Physical cable damage or disconnection');
      if (answers[5] === 'yes') problemIndicators.push('Storage or recording configuration issues');
    }
    else if (category === 'biometrics') {
      if (answers[0] === 'yes') problemIndicators.push('Scanner hardware failure or calibration required');
      if (answers[1] === 'yes') problemIndicators.push('Network connectivity or server communication problems');
      if (answers[2] === 'yes') problemIndicators.push('Authentication system or database issues');
      if (answers[3] === 'yes') problemIndicators.push('Device software crash or firmware issues');
      if (answers[4] === 'yes') problemIndicators.push('User registration or database issues');
      if (answers[5] === 'yes') problemIndicators.push('Logging system failure or configuration issues');
    }
    else if (category === 'servers') {
      if (answers[0] === 'yes') problemIndicators.push('Power supply or motherboard failure');
      if (answers[1] === 'yes') problemIndicators.push('Permissions, network shares, or file system issues');
      if (answers[2] === 'yes') problemIndicators.push('Hardware failure or cooling system malfunction');
      if (answers[3] === 'yes') problemIndicators.push('System instability or hardware failures');
      if (answers[4] === 'yes') problemIndicators.push('Storage capacity issues or disk errors');
      if (answers[5] === 'yes') problemIndicators.push('Service configuration or network setup problems');
    }

    // Add problem indicators to summary
    if (problemIndicators.length > 0) {
      summary += 'Potential issues identified:\n';
      problemIndicators.forEach((indicator, index) => {
        summary += `${index + 1}. ${indicator}\n`;
      });
    } else {
      summary += 'No specific issues identified from questionnaire responses.\n';
    }

    // Add urgency assessment
    const urgentIssues = {
      cctv: [0, 2], // Power issues and DVR/NVR issues are urgent for CCTV
      biometrics: [0, 2], // Scanner failure and authentication issues are urgent for biometrics
      servers: [0, 2, 3], // Power, hardware, and crash issues are urgent for servers
    };

    let urgentCount = 0;
    urgentIssues[category].forEach(index => {
      if (answers[index] === 'yes') urgentCount++;
    });

    if (urgentCount > 0) {
      summary += '\nPRIORITY ASSESSMENT: HIGH - Contains critical system issues.\n';
    } else {
      summary += '\nPRIORITY ASSESSMENT: STANDARD\n';
    }

    // Add recommendation based on user's userDescription if available
    if (userDescription && userDescription.trim()) {
      summary += '\nADDITIONAL NOTES FROM CLIENT:\n';
      summary += userDescription.trim();
    }

    return summary;
  };

  const handleSubmit = () => {
    // Generate diagnostic summary
    const diagnosticSummary = generateDiagnosticSummary();
    const loadUserID = async () => {
      try {
        const storedID = await AsyncStorage.getItem('userID');
        if (storedID) {
          setUserID(storedID); // storedID is a string
        }
      } catch (error) {
        console.error('Failed to load userID from storage:', error);
      }
    };
    loadUserID();
    console.log("userID"+userID)
    if(!userID){
      return ;
    }
    const ticketData = {
      description: diagnosticSummary,
      priority: "N/A",
      status: "Open",
      client: {
        userID: 1
      }
    };

    console.log("About to send data");
    fetch(`http://localhost:8080/api/tickets/createTicket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    }).then(res=>{
      if(!res.ok){
        throw new Error("Failed to create ticket"+res);
      }
      return res.json();
    }).then(data=>{
      console.log("New ticket:"+data);
      
    }).catch(error=>{
      console.error(error);
    });

    Alert.alert('Ticket Submitted', 'Your request has been submitted successfully.');
    setCategory('');
    setAnswers({});
    setDescription('');
  };

  const handleCancel = () => {
    setCategory('');
    setAnswers({});
    setDescription('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>🛠 New Support Ticket</Text>

        <Text style={styles.label}>Maintenance Category</Text>
        <TouchableOpacity
          style={styles.modalPickerButton}
          onPress={handleCategorySelect}
        >
          <Text style={styles.modalPickerText}>
            {category ? category.toUpperCase() : 'Select Category'}
          </Text>
        </TouchableOpacity>

        {category !== '' &&
          questions[category].map((question, index) => (
            <View key={index} style={styles.questionBlock}>
              <Text style={styles.questionText}>{question}</Text>
              <TouchableOpacity
                style={styles.modalPickerButton}
                onPress={() =>
                  showPicker(
                    [
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                      { label: 'Not Sure', value: 'not_sure' },
                    ],
                    'Select Answer',
                    (value) => handleAnswerChange(index, value)
                  )
                }
              >
                <Text style={styles.modalPickerText}>
                  {answers[index]
                    ? answers[index] === 'yes'
                      ? 'Yes'
                      : answers[index] === 'no'
                        ? 'No'
                        : 'Not Sure'
                    : 'Select Response'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

        {category !== '' && (
          <>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Describe the issue in detail"
              style={styles.textArea}
              multiline
              value={userDescription}
              onChangeText={setDescription}
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={handleCancel}
                style={[styles.btn, styles.btnSecondary]}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.btn, styles.btnPrimary]}
              >
                <Text style={styles.btnText}>Submit Ticket</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Custom Modal Picker */}
      <Modal visible={pickerVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{pickerTitle}</Text>
            {pickerOptions.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  pickerCallback(option.value);
                  setPickerVisible(false);
                  setPressedIndex(null);
                }}
                onPressIn={() => setPressedIndex(index)}
                onPressOut={() => setPressedIndex(null)}
                style={[
                  styles.modalOption,
                  pressedIndex === index && styles.modalOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    pressedIndex === index && styles.modalOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
            <TouchableOpacity onPress={() => setPickerVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 10,
    width: '100%',
    maxWidth: 600,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    color: '#343a40',
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#495057',
  },
  modalPickerButton: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  modalPickerText: {
    fontSize: 14,
    color: '#343a40',
  },
  questionBlock: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343a40',
    marginBottom: 6,
  },
  textArea: {
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 120,
  },
  btnPrimary: {
    backgroundColor: '#ffc107',
  },
  btnSecondary: {
    backgroundColor: '#adb5bd',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
    color: '#212529',
  },
  modalOption: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderRadius: 6,
  },
  modalOptionActive: {
    backgroundColor: '#ffe69c',
  },
  modalOptionText: {
    textAlign: 'center',
    color: '#212529',
    fontSize: 15,
  },
  modalOptionTextActive: {
    fontWeight: '600',
    color: '#343a40',
  },
  modalCancel: {
    marginTop: 10,
    fontSize: 14,
    color: '#868e96',
  },
  // Keeping diagnostic summary styles for potential admin view
  diagnosticSummaryContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  diagnosticSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  diagnosticSummaryContent: {
    maxHeight: 150,
  },
  diagnosticSummaryText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#343a40',
    fontFamily: 'monospace',
  },
});

export default TroubleshootingFormScreen;