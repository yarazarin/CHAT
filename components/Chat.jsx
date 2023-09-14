import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, selectedColor, userId } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      const unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        setMessages(newMessages);

        // Cache messages in AsyncStorage
        AsyncStorage.setItem("chat_messages", JSON.stringify(newMessages));
      });

      return () => {
        if (unsubMessages) unsubMessages();
      };
    } else {
      // Load cached messages from AsyncStorage when offline
      AsyncStorage.getItem("chat_messages")
        .then((cachedMessages) => {
          if (cachedMessages) {
            setMessages(JSON.parse(cachedMessages));
          }
        })
        .catch((error) => {
          console.error("Error loading cached messages:", error);
        });
    }
  }, [isConnected]);

  const onSend = async (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#ff7979",
            minWidth: 150,
          },
          left: {
            backgroundColor: "#ffbe76",
            minWidth: 150,
            left: -50,
          },
        }}
      />
    );
  };

  // Render InputToolbar based on network connectivity
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}

      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: route.params.userId,
          name: route.params.name,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
