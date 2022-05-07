import { Overlay, Button, CheckBox } from "@rneui/themed";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { React, useState } from "react";
import PropTypes from "prop-types";
import { COLORS } from "../../styles/colors";

const AddExerciseOverlay = (props) => {
  const [exerciseNameText, setExerciseNameText] = useState("");
  const [repsText, setRepsText] = useState("");
  const [isTimer, setIsTimer] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const validateExercise = (name, reps) => {
    return name.length != 0 && reps.length != 0 && parseInt(reps) > 0;
  };

  const resetFields = () => {
    setExerciseNameText("");
    setRepsText("");
    setIsTimer(false);
    setSaveButtonEnabled(false);
  };

  return (
    <Overlay
      isVisible={props.overlayVisible}
      onBackdropPress={() => {
        props.setOverlayVisible(!props.overlayVisible);
        resetFields();
      }}
      overlayStyle={{ margin: 0, padding: 0, borderRadius: 20 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
          <View style={[styles.excerciseName, { marginTop: 15 }]}>
            <TextInput
              style={styles.excerciseNameText}
              placeholder="Excercise name"
              value={exerciseNameText}
              onChangeText={(value) => {
                setExerciseNameText(value);
                setSaveButtonEnabled(validateExercise(value, repsText));
              }}
              placeholderTextColor={COLORS.placeholderText}
              maxLength={30}
            />
          </View>
          <View style={styles.excerciseName}>
            <TextInput
              style={styles.excerciseNameText}
              placeholder="Reps or Seconds"
              keyboardType="number-pad"
              value={repsText}
              onChangeText={(value) => {
                setRepsText(value);
                setSaveButtonEnabled(validateExercise(exerciseNameText, value));
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
            checked={isTimer}
            onPress={() => setIsTimer(!isTimer)}
            uncheckedColor="black"
            checkedColor="black"
          />
          <Button
            title="Add"
            activeOpacity={0.5}
            disabled={!saveButtonEnabled}
            titleStyle={styles.buttonText}
            containerStyle={styles.saveButtonContainer}
            buttonStyle={styles.saveButton}
            onPress={() => {
              props.addExercise(exerciseNameText, repsText, isTimer);
              props.setOverlayVisible(false);
              resetFields();
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </Overlay>
  );
};

AddExerciseOverlay.propTypes = {
  addExercise: PropTypes.func.isRequired,
  overlayVisible: PropTypes.bool.isRequired,
  setOverlayVisible: PropTypes.func.isRequired,
};

const styles = {
  overlay: {
    height: 300,
    width: 300,
    borderRadius: 15,
    backgroundColor: COLORS.secondaryBackground,
    padding: 10,
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

export default AddExerciseOverlay;
