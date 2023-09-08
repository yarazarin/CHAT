import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";

import { getAuth, signInAnonymously } from "firebase/auth";


const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#090C08");

  const handleStartChat = () => {
    const auth = getAuth();
    
    signInAnonymously(auth)
      .then((userCredential) => {

        const user = userCredential.user;
        const userId = user.uid;
  
        navigation.navigate("Chat", { userId, name, selectedColor });
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
  };

  const colorOptions = ["#b3dcff", "#b3ffdf", "#f6ffb3", "#ffb3b3"];

  return (
    <ImageBackground
      source={require("../assets/backgroundImage.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.appTitle}>Chat</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Your name"
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
          <View style={styles.colorOptions}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: color,
                    borderColor:
                      color === selectedColor ? "#757083" : "transparent",
                  },
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={handleStartChat}
            style={styles.startButton}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    fontSize: 60,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    width: "80%",
    marginBottom: 20,
    backgroundColor: "white",
  },
  colorOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    marginBottom: 20,
    gap: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffcccc",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  startButton: {
    backgroundColor: "#ffcccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#999",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Start;
