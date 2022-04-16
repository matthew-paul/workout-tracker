import { Text, View } from "react-native";
import React, { Component } from "react";
import { COLORS } from "../styles/colors";
import Title from "../components/Title";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function clearWorkouts() {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // saving error
  }
}

export class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Title text="Home" style={styles.title} />
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("Workout List");
            }}
          >
            <Text style={styles.buttonText}>Workouts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button]} onPress={() => {}}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  view: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    marginBottom: 0,
  },
  content: {
    paddingTop: "50%",
  },
  text: {
    fontSize: 25,
    fontFamily: "Arial-BoldMT",
    alignSelf: "center",
    color: COLORS.text,
  },
  button: {
    width: 140,
    height: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.button,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 22,
    fontFamily: "Arial",
    color: COLORS.buttonText,
  },
};

export default HomeScreen;
