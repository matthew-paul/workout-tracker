import WorkoutScreen from "./screens/WorkoutScreen";
import HomeScreen from "./screens/HomeScreen";
import WorkoutListScreen from "./screens/WorkoutListScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateWorkout from "./screens/CreateWorkout";

const Stack = createNativeStackNavigator();

export default function App() {
  const excercises = [
    ["Pushups", 5, false],
    ["Rest", 30, true],
    ["Squats", 15, false],
    ["Rest", 30, true],
    ["Plank", 45, true],
    ["Rest", 30, true],
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Workout List"
          component={WorkoutListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Workout Screen"
          component={WorkoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Create Workout"
          component={CreateWorkout}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
