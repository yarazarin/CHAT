import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  // Extract parameters from the route
  const { name, selectedColor, userId } = route.params;

  // State to manage chat messages
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected) {
      // Query messages from Firestore and set in state
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
      Alert.alert(
        "You are offline",
        "Please check your internet connection.",
        [
          {
            text: "OK",
            onPress: () => {
              console.log("OK");
            },
          },
        ],
        { cancelable: false }
      );

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

  // Function to handle sending new messages
  const onSend = async (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Custom rendering of chat bubbles
  const renderBubble = (props) => {
    // Customize bubble styles
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

  // Render the input toolbar based on connectivity
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Custom rendering of actions (e.g., attachments) in the input toolbar
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  // Custom rendering of location messages
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <>
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
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          user={{
            _id: userId,
            name: name,
          }}
        ></GiftedChat>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
