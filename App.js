import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const Stack = createStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBUz9V1bMM41IbuBzFjhz-b5eucUUl-2t0",
    authDomain: "letstalk-9a4aa.firebaseapp.com",
    projectId: "letstalk-9a4aa",
    storageBucket: "letstalk-9a4aa.appspot.com",
    messagingSenderId: "1089053181791",
    appId: "1:1089053181791:web:b30e4276b2bfe7b94b58ea"
  };
  
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
          component={Chat}
          initialParams={{ db }}
          options={({ route }) => ({ title: route.params.name })}
        >
          {/* {(props) => <Chat db={db} {...props} />} */}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
