import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../constants/api';

type Message = { id: string; text: string; sender: 'user' | 'ai' };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages((prev) => [...prev, { id: Date.now().toString() + Math.random(), text, sender }]);
  };

  useEffect(() => {
    startChat();
  }, []);

  const startChat = async () => {
    setLoading(true);
    try {
      const res = await api.post('/chat/start');
      const { conversation_id, reply, next_question } = res.data;
      setConversationId(conversation_id);
      addMessage(reply, 'ai');
      if (next_question) addMessage(next_question, 'ai');
    } catch (err: any) {
      addMessage('Could not connect to OneHop AI. Check your backend connection.', 'ai');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || sending) return;
    const userText = input;
    addMessage(userText, 'user');
    setInput('');
    setSending(true);

    try {
      const res = await api.post('/chat/message', {
        message: userText,
        conversation_id: conversationId,
      });
      const { reply, next_question, is_complete, itinerary: tripItinerary } = res.data;

      if (reply) addMessage(reply, 'ai');
      if (next_question) addMessage(next_question, 'ai');

      if (is_complete) {
        setIsComplete(true);
        setItinerary(tripItinerary);
      }
    } catch (err: any) {
      addMessage(err?.response?.data?.detail ?? 'Something went wrong. Try again.', 'ai');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <Text style={styles.header}>OneHop AI</Text>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0077b6" />
            <Text style={{ marginTop: 10, color: '#666' }}>Connecting to OneHop AI...</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
              </View>
            )}
          />
        )}

        {isComplete && itinerary && (
          <View style={styles.itineraryBox}>
            <Text style={styles.itineraryTitle}>
              {itinerary.city} — {itinerary.duration}
            </Text>
            <Text style={styles.itinerarySub}>
              Estimated cost: ₹{itinerary.cost_estimate?.total_estimated} (
              {itinerary.cost_estimate?.within_budget ? 'within budget ✅' : 'over budget ⚠️'})
            </Text>
          </View>
        )}

        {!isComplete && (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type your answer..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              editable={!sending}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={sending}>
              {sending ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="send" size={20} color="#fff" />}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', padding: 16, paddingBottom: 8 },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bubble: { padding: 12, borderRadius: 14, marginBottom: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#0077b6', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#f1f1f1', alignSelf: 'flex-start' },
  userText: { color: '#fff' },
  aiText: { color: '#222' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  input: { flex: 1, backgroundColor: '#f1f1f1', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10 },
  sendButton: { backgroundColor: '#0077b6', borderRadius: 20, padding: 10, width: 40, alignItems: 'center' },
  itineraryBox: { backgroundColor: '#e6f4ea', padding: 16, margin: 16, borderRadius: 14 },
  itineraryTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  itinerarySub: { fontSize: 13, color: '#333' },
});