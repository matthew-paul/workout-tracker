import { Text, View, TextInput, Keyboard, Image } from "react-native";
import React, { useReducer } from "react";
import { COLORS } from "../styles/colors";
import Title from "../components/Title";
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { Overlay, Button, CheckBox } from "@rneui/themed";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  workoutNameText: "",
  saveWorkoutButtonEnabled: false,
  overlayVisible: false,
  exerciseNameText: "",
  repsText: "",
  isTimer: false,
  saveExerciseButtonEnabled: false,
  exercises: [],
};

const validateExercise = (name, reps) => {
  return name.length != 0 && reps.length != 0 && parseInt(reps) > 0;
};

const validateWorkout = (name, exercises) => {
  return name.length != 0 && exercises.length != 0;
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
  const reducer = (state, action) => {
    switch (action.type) {
      case "updateExerciseName":
        return {
          ...state,
          exerciseNameText: action.value,
          saveExerciseButtonEnabled: validateExercise(
            action.value,
            state.repsText
          ),
        };
      case "updateRepsText":
        return {
          ...state,
          repsText: action.value,
          saveExerciseButtonEnabled: validateExercise(
            state.exerciseNameText,
            action.value
          ),
        };
      case "updateWorkoutName":
        return {
          ...state,
          workoutNameText: action.value,
          saveWorkoutButtonEnabled: validateWorkout(
            action.value,
            state.exercises
          ),
        };
      case "addExercise":
        if (validateExercise(state.exerciseNameText, state.repsText))
          return {
            ...state,
            exerciseNameText: "",
            repsText: "",
            isTimer: false,
            saveExerciseButtonEnabled: validateExercise(
              state.exerciseNameText,
              state.repsText
            ),
            saveWorkoutButtonEnabled: validateWorkout(state.workoutNameText, [
              ...state.exercises,
              {},
            ]),
            overlayVisible: !state.overlayVisible,
            exercises: [
              ...state.exercises,
              {
                key: state.exercises.length,
                exerciseName: state.exerciseNameText,
                reps: state.repsText,
                isTimer: state.isTimer,
              },
            ],
          };
      case "addWorkout":
        if (validateWorkout(state.workoutNameText, state.exercises))
          getWorkouts()
            .then((workouts) => {
              addWorkout(workouts, state.workoutNameText, state.exercises).then(
                () => navigation.goBack()
              );
            })
            .catch();
        return state;
      case "toggleOverlay":
        return {
          ...state,
          exerciseNameText: "",
          repsText: "",
          isTimer: false,
          saveExerciseButtonEnabled: validateExercise(
            state.exerciseNameText,
            state.repsText
          ),
          saveWorkoutButtonEnabled: validateWorkout(
            state.workoutNameText,
            state.exercises
          ),
          overlayVisible: !state.overlayVisible,
        };
      case "toggleTimer":
        return { ...state, isTimer: !state.isTimer };
      case "deleteRow":
        let newData = [...state.exercises];
        newData.splice(action.prevIndex, 1);
        return { ...state, exercises: newData };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const addWorkout = async (workouts, name, exercises) => {
    let workoutObject = { name: name, exercises: exercises };
    let newWorkouts;
    if (workouts != null) newWorkouts = [...workouts, workoutObject];
    else newWorkouts = [workoutObject];
    await storeWorkouts(newWorkouts);
  };

  const deleteRow = (rowMap, rowKey) => {
    const prevIndex = state.exercises.findIndex((item) => item.key === rowKey);
    dispatch({ type: "deleteRow", prevIndex: prevIndex });
  };

  const renderItem = (data) => {
    return (
      <TouchableHighlight underlayColor={COLORS.darkButtonHighlight}>
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
            value={state.workoutNameText}
            onChangeText={(value) => {
              dispatch({ type: "updateWorkoutName", value: value });
            }}
            placeholderTextColor={COLORS.placeholderText}
            maxLength={35}
          />
          {state.workoutNameText.length > 0 ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                dispatch({ type: "updateWorkoutName", value: "" });
              }}
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

        <Overlay
          isVisible={state.overlayVisible}
          onBackdropPress={() => {
            dispatch({ type: "toggleOverlay" });
          }}
          overlayStyle={{ margin: 0, padding: 0, borderRadius: 20 }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.overlay}>
              <View style={[styles.excerciseName, { marginTop: 15 }]}>
                <TextInput
                  style={styles.excerciseNameText}
                  placeholder="Excercise name"
                  value={state.exerciseNameText}
                  onChangeText={(value) =>
                    dispatch({ type: "updateExerciseName", value: value })
                  }
                  placeholderTextColor={COLORS.placeholderText}
                  maxLength={30}
                />
              </View>
              <View style={styles.excerciseName}>
                <TextInput
                  style={styles.excerciseNameText}
                  placeholder="Reps or Seconds"
                  keyboardType="number-pad"
                  value={state.repsText}
                  onChangeText={(value) => {
                    dispatch({ type: "updateRepsText", value: value });
                  }}
                  placeholderTextColor={COLORS.placeholderText}
                  maxLength={35}
                />
              </View>
              <CheckBox
                center
                title="Timer"
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxTextStyle}
                checked={state.isTimer}
                onPress={() => {
                  dispatch({ type: "toggleTimer" });
                }}
                uncheckedColor="black"
                checkedColor="black"
              />
              <Button
                title="Add"
                activeOpacity={0.5}
                disabled={!state.saveExerciseButtonEnabled}
                titleStyle={styles.buttonText}
                containerStyle={styles.saveButtonContainer}
                buttonStyle={styles.saveButton}
                onPress={() => {
                  dispatch({ type: "addExercise" });
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </Overlay>

        {state.exercises.length > 0 ? (
          <View style={styles.swipeListView}>
            <SwipeListView
              disableRightSwipe
              data={state.exercises}
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
          onPress={() => {
            dispatch({ type: "toggleOverlay" });
          }}
          activeOpacity={0.8}
        />

        <Button
          title="Save"
          activeOpacity={0.8}
          disabled={!state.saveWorkoutButtonEnabled}
          titleStyle={styles.buttonText}
          containerStyle={styles.saveButtonContainer}
          buttonStyle={styles.saveButton}
          onPress={() => {
            dispatch({ type: "addWorkout" });
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
  exerciseItemContainer: {
    paddingLeft: 10,
    justifyContent: "center",
    backgroundColor: COLORS.button,
    height: 50,
  },
  excerciseName: {
    height: 40,
    borderColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 25,
  },
  excerciseNameText: {
    flex: 1,
    fontSize: 20,
    textAlign: "center",
    color: COLORS.secondaryText,
  },
  checkboxContainer: {
    backgroundColor: COLORS.secondaryBackground,
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 15,
  },
  checkboxTextStyle: {
    fontSize: 20,
    fontFamily: "Arial",
    fontWeight: "normal",
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
  overlay: {
    height: 300,
    width: 300,
    borderRadius: 15,
    backgroundColor: COLORS.secondaryBackground,
    padding: 10,
  },
};

export default CreateWorkout;
