import {
  Text,
  View,
  TextInput,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../styles/colors";
import Title from "../components/Title";
import { Button } from "@rneui/themed";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddExerciseOverlay from "../components/create_workout/AddExerciseOverlay";

const validateWorkout = (name, exercisesLength) => {
  return name.length != 0 && exercisesLength != 0;
};

const getWorkouts = async () => {
  try {
    const workouts = await AsyncStorage.getItem("@workouts");
    return workouts != null ? JSON.parse(workouts) : [];
  } catch (e) {
    // error reading value
  }
};

const storeWorkouts = async (workouts) => {
  try {
    await AsyncStorage.setItem("@workouts", JSON.stringify(workouts));
  } catch (e) {
    // saving error
  }
};

const CreateWorkout = ({ navigation }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);

  // validate workout on change
  useEffect(() => {
    setSaveButtonEnabled(validateWorkout(workoutName, exercises.length));
  }, [workoutName, exercises]);

  const addExercise = (name, reps, isTimer) => {
    setExercises([
      ...exercises,
      {
        key: exercises.length,
        exerciseName: name,
        reps: reps,
        isTimer: isTimer,
      },
    ]);
  };

  const addWorkout = async (name, exercises) => {
    getWorkouts()
      .then((workouts) => {
        let workoutObject = { name: name, exercises: exercises };
        let newWorkouts =
          workouts != null ? [...workouts, workoutObject] : [workoutObject];
        storeWorkouts(newWorkouts).then(() => navigation.goBack());
      })
      .catch();
  };

  const deleteRow = (_, rowKey) => {
    const prevIndex = exercises.findIndex((item) => item.key === rowKey);
    let newExercises = [...exercises];
    newExercises.splice(prevIndex, 1);
    setExercises(newExercises);
  };

  const renderItem = (data) => {
    return (
      <TouchableHighlight
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
              height: "90%",
              justifyContent: "center",
              width: 80,
              borderRightWidth: 2,
              borderColor: "white",
            }}
          >
            <Text style={[styles.swipeListText, { textAlign: "center" }]}>
              {data.item.reps}
              {data.item.isTimer ? "s" : ""}
            </Text>
          </View>
          <View
            style={{
              flex: 0.8,
              marginLeft: 25,
              alignItems: "start",
            }}
          >
            <Text style={[styles.swipeListText, { textAlign: "left" }]}>
              {data.item.exerciseName}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key)}
      >
        <Text style={styles.swipeListText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.view}>
        <Title text="Create Workout" style={styles.title} />
        <View style={styles.workoutName}>
          <TextInput
            style={styles.textInput}
            placeholder="Workout name"
            value={workoutName}
            onChangeText={(value) => setWorkoutName(value)}
            placeholderTextColor={COLORS.placeholderText}
            maxLength={35}
          />
          {workoutName.length > 0 ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setWorkoutName("")}
            >
              <Image
                style={styles.cancelButtonImage}
                source={require("../assets/clear-text.png")}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Exercises</Text>
        </View>
        <AddExerciseOverlay
          addExercise={addExercise}
          overlayVisible={overlayVisible}
          setOverlayVisible={setOverlayVisible}
        />
        {exercises.length > 0 ? (
          <View style={styles.swipeListView}>
            <SwipeListView
              disableRightSwipe
              data={exercises}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-75}
              previewRowKey={"0"}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              stopRightSwipe={-100}
            />
          </View>
        ) : (
          <></>
        )}
        <Button
          title="Add new exercise"
          titleStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          buttonStyle={{ backgroundColor: COLORS.button }}
          onPress={() => setOverlayVisible(true)}
          activeOpacity={0.8}
        />
        <Button
          title="Save"
          activeOpacity={0.8}
          disabled={!saveButtonEnabled}
          titleStyle={styles.buttonText}
          containerStyle={styles.saveButtonContainer}
          buttonStyle={styles.saveButton}
          onPress={() => {
            addWorkout(workoutName, exercises);
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  view: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    marginBottom: 30,
  },
  workoutName: {
    height: 50,
    flexDirection: "row",
    borderColor: "#aaccff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 30,
  },
  listItemSwipeable: {},
  listItemContent: {
    height: 50,
    backgroundColor: COLORS.darkButton,
  },

  swipeListView: {
    maxHeight: 530,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
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
  textInput: {
    flex: 1,
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
    color: COLORS.text,
  },
  cancelButton: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonImage: {
    height: 40,
    width: 40,
  },
  headerView: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#fff",
  },
  headerText: {
    textAlign: "center",
    paddingBottom: 5,
    color: COLORS.text,
    fontSize: 22,
  },
  buttonContainer: {
    width: "100%",
    alignSelf: "center",
    marginTop: 18,
  },
  buttonText: {
    fontSize: 20,
  },
  saveButtonContainer: {
    marginTop: 10,
    width: 100,
    alignSelf: "center",
  },
  saveButton: {
    backgroundColor: COLORS.saveButton,
  },
};

export default CreateWorkout;
