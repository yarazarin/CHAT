import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { useNetInfo } from "@react-native-community/netinfo";


import { LogBox } from "react-native";
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Initialize Stack Navigator
const Stack = createStackNavigator();

const App = () => {

  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected;


  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBUz9V1bMM41IbuBzFjhz-b5eucUUl-2t0",
    authDomain: "letstalk-9a4aa.firebaseapp.com",
    projectId: "letstalk-9a4aa",
    storageBucket: "letstalk-9a4aa.appspot.com",
    messagingSenderId: "1089053181791",
    appId: "1:1089053181791:web:b30e4276b2bfe7b94b58ea",
  };

  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        ></Stack.Screen>

        <Stack.Screen
          name="Chat"
          options={({ route }) => ({ title: route.params.name })}
        >
          {({ navigation, route }) => (
            <Chat db={db} navigation={navigation} route={route} isConnected={isConnected} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
