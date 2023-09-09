import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  const { name, selectedColor, userId } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });
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
    });
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

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
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: route.params.userId,
          name: route.params.name,
          // _id: userID,
          // name
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
