import { Text, View } from "react-native";
import React, { Component, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Title from "../components/Title";
import { COLORS } from "../styles/colors";
import { TouchableOpacity, TouchableHighlight } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

export class WorkoutListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { workouts: [] };
    this.retrieveWorkouts();
  }

  retrieveWorkouts = async () => {
    this.getWorkouts()
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          data[i]["key"] = i;
        }
        this.setState({ workouts: data });
      })
      .catch();
  };

  getWorkouts = async () => {
    try {
      const workouts = await AsyncStorage.getItem("@workouts");
      return workouts != null ? JSON.parse(workouts) : [];
    } catch (e) {
      // error reading value
    }
  };

  storeWorkouts = async (workouts) => {
    try {
      await AsyncStorage.setItem("@workouts", JSON.stringify(workouts));
    } catch (e) {
      // save error
    }
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.retrieveWorkouts();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  deleteRow = (rowMap, rowKey) => {
    const prevIndex = this.state.workouts.findIndex(
      (item) => item.key === rowKey
    );
    let newData = [...this.state.workouts];
    newData.splice(prevIndex, 1);
    this.setState({ workouts: newData });
    this.storeWorkouts(newData);
  };

  renderItem = (data) => {
    return (
      <TouchableHighlight
        onPress={() =>
          this.props.navigation.navigate("Workout Screen", {
            exercises: data.item.exercises,
          })
        }
        style={styles.rowFront}
        underlayColor={COLORS.darkButtonHighlight}
      >
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 0.8,
              marginLeft: 25,
              alignItems: "start",
            }}
          >
            <Text style={[styles.swipeListText, { textAlign: "left" }]}>
              {data.item.name}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => this.deleteRow(rowMap, data.item.key)}
      >
        <Text style={styles.swipeListText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <View style={styles.view}>
        <Title text="Workouts" style={styles.title} />
        <View style={styles.createWorkoutContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              { backgroundColor: COLORS.createButtonColor },
            ]}
            onPress={() => {
              this.props.navigation.navigate("Create Workout");
            }}
          >
            <View style={styles.listItem}>
              <Text style={[styles.workoutListText, { alignSelf: "center" }]}>
                Create Workout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.swipeListView}>
          <SwipeListView
            disableRightSwipe
            data={this.state.workouts}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-75}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            stopRightSwipe={-100}
          />
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
    marginBottom: 30,
  },
  createWorkoutContainer: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderColor: "white",
  },
  listItem: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  workoutListText: {
    fontSize: 22,
    paddingLeft: 10,
    color: COLORS.buttonText,
  },
  button: {
    backgroundColor: COLORS.button,
    borderRadius: 5,
    marginBottom: 5,
  },
  swipeListView: {
    maxHeight: 530,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomColor: "white",
  },
  swipeListText: {
    color: COLORS.text,
    fontSize: 18,
  },
  rowFront: {
    borderRadius: 5,
    backgroundColor: COLORS.darkButton,
    marginBottom: 3,
    justifyContent: "center",
    height: 50,
  },
  rowBack: {
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: COLORS.darkButton,
    flex: 1,
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backRightBtn: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
};

export default WorkoutListScreen;
