import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TicketDetailsScreen() {
  const router = useRouter();
  const { ticketID } = useLocalSearchParams();
  console.log("ticketID from params:", ticketID);

  const [ticketData, setTicketData] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load ticketData from AsyncStorage asynchronously
  useEffect(() => {
    async function loadTicketData() {
      try {
        const storedTickets = await AsyncStorage.getItem("ticketData");
        if (storedTickets) {
          const tickets = JSON.parse(storedTickets);
          const ticket = tickets.find((t) => t.ticketID == ticketID);
          setTicketData(ticket || null);
        }else {
          const userID = await AsyncStorage.getItem('userID');
          // Now do something with userID if needed (you're not using it here though)
          const response = await fetch(`http://localhost:8080/api/tickets/${ticketID}`);
          if (!response.ok) throw new Error("Could not fetch tickets");
          const data = await response.json();
          setTicketData(data);
          console.log("Ticket data found:"+data);
        }
      } catch (error) {
        console.error("Failed to load ticket data", error);
      }
    }
    loadTicketData();
  }, [ticketID]);

  // Fetch task info related to this ticket
  useEffect(() => {
    if (!ticketID) return;
    fetch(`http://localhost:8080/api/tasks/ticketID/${ticketID}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task");
        return res.json();
      })
      .then((data) => {
        setTask(data || null); // data may be null or empty
      })
      .catch((error) => {
        console.error(error);
        setTask(null);
      })
      .finally(() => setLoading(false));
  }, [ticketData]);

  if ( !ticketData) {
    return (
      <View style={[styles.container, { justifyContent: "center", flex: 1 }]}>
        <ActivityIndicator size="large" color="#facc15" />
        <Text style={{ marginTop: 10 }}>Loading ticket details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.label}>Ticket Title</Text>
            <Text style={styles.label}>{ticketData.title || "No Title"}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{ticketData.status || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Assigned Technician */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Feather name="tool" size={16} color="#555" />
          <Text style={styles.sectionTitle}>Assigned Technician</Text>
        </View>
        <View style={styles.sectionBody}>
          {task?.technician ? (
            <>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Name:</Text>
                <Text style={styles.fieldValue}>{task.technician.name}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Surname:</Text>
                <Text style={styles.fieldValue}>{task.technician.surname}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Email:</Text>
                <Text style={styles.fieldValue}>{task.technician.email}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Phone:</Text>
                <Text style={styles.fieldValue}>{task.technician.phoneNumber}</Text>
              </View>
            </>
          ) : (
            <Text style={{ fontStyle: "italic", color: "#888" }}>
              Technician not assigned yet.
            </Text>
          )}
        </View>
      </View>

      {/* Ticket Details */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Feather name="file-text" size={16} color="#555" />
          <Text style={styles.sectionTitle}>Ticket Details</Text>
        </View>
        <View style={styles.sectionBody}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Description:</Text>
            <Text style={styles.fieldValue}>{ticketData.description || "N/A"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Client Company:</Text>
            <Text style={styles.fieldValue}>
              {ticketData.client?.companyName || "N/A"}
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Date Created:</Text>
            <Text style={styles.fieldValue}>
              {new Date(ticketData.dateCreated).toLocaleString() || "N/A"}
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Priority:</Text>
            <Text style={styles.fieldValue}>{ticketData.priority || "N/A"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Status:</Text>
            <Text style={styles.fieldValue}>{ticketData.status || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Review Button */}
      <View style={styles.buttonWrapper}>
        <Pressable
          style={styles.reviewButton}
          onPress={() => router.push("/review")}
        >
          <FontAwesome name="star" size={14} color="white" />
          <Text style={styles.reviewText}>Review</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "#22c55e", // green for "Completed"
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  section: {
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  sectionBody: {
    padding: 16,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  fieldValue: {
    fontSize: 14,
    color: "#000",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#facc15", // YELLOW!
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reviewText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
});
