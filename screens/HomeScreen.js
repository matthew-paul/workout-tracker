import { Text, View, StyleSheet, FlatList } from "react-native";
import React, { Component } from "react";
import { COLORS } from "../styles/colors";
import Title from "../components/Title";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RectButton } from "react-native-gesture-handler";

async function clearWorkouts() {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // saving error
  }
}

export default class HomeScreen extends Component {
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
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: "white",
  },
  separator: {
    backgroundColor: "rgb(200, 199, 204)",
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  messageText: {
    color: "#999",
    backgroundColor: "transparent",
  },
  dateText: {
    backgroundColor: "transparent",
    position: "absolute",
    right: 20,
    top: 10,
    color: "#999",
    fontWeight: "bold",
  },
};

const DATA = [
  {
    from: "D'Artagnan",
    when: "3:11 PM",
    message:
      "Unus pro omnibus, omnes pro uno. Nunc scelerisque, massa non lacinia porta, quam odio dapibus enim, nec tincidunt dolor leo non neque",
  },
];
