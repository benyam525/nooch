import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProgressLog {
  id: string;
  type: string;
  content: string;
  date: Date;
  icon: keyof typeof Ionicons.glyphMap;
}

const mockLogs: ProgressLog[] = [
  {
    id: "1",
    type: "Weight",
    content: "Updated weight: 195 lbs",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: "scale-outline",
  },
  {
    id: "2",
    type: "Meal",
    content: "Logged breakfast: Oatmeal with berries",
    date: new Date(Date.now() - 1000 * 60 * 60 * 8),
    icon: "restaurant-outline",
  },
  {
    id: "3",
    type: "Workout",
    content: "Completed: 30 min cardio session",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: "barbell-outline",
  },
  {
    id: "4",
    type: "Water",
    content: "Drank 8 glasses of water",
    date: new Date(Date.now() - 1000 * 60 * 60 * 26),
    icon: "water-outline",
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: ProgressLog }) => (
    <View style={styles.logItem}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={24} color="#22c55e" />
      </View>
      <View style={styles.logContent}>
        <Text style={styles.logType}>{item.type}</Text>
        <Text style={styles.logText}>{item.content}</Text>
        <Text style={styles.logTime}>{formatRelativeTime(item.date)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress History</Text>
      </View>

      {mockLogs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No progress logs yet</Text>
          <Text style={styles.emptyText}>
            Start logging your meals, workouts, and progress in the chat.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mockLogs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  list: {
    padding: 16,
  },
  logItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22c55e",
    textTransform: "uppercase",
  },
  logText: {
    fontSize: 16,
    color: "#1f2937",
    marginTop: 4,
  },
  logTime: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
});
