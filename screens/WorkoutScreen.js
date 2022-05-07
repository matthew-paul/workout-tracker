import { Text, View } from "react-native";
import React, { Component } from "react";
import { COLORS } from "../styles/colors";
import Checkbox from "../components/view_workout/Checkbox";
import Title from "../components/Title";
import PropTypes from "prop-types";

export class WorkoutScreen extends Component {
  render() {
    var excerciseComponents = [];
    if (this.props.route.params.exercises != null) {
      for (let i = 0; i < this.props.route.params.exercises.length; i++) {
        excerciseComponents.push(
          <Checkbox
            key={this.props.route.params.exercises[i].key}
            text={this.props.route.params.exercises[i].exerciseName}
            counterValue={parseInt(this.props.route.params.exercises[i].reps)}
            isTimer={this.props.route.params.exercises[i].isTimer}
          />
        );
      }
    }
    return (
      <View style={styles.viewStyle}>
        <Title text="Workout Tracker" style={styles.title} />
        {excerciseComponents}
      </View>
    );
  }
}

WorkoutScreen.propTypes = {
  excercises: PropTypes.array,
};

const styles = {
  viewStyle: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    marginBottom: 40,
  },
  textStyle: {
    fontSize: 25,
    fontFamily: "Arial-BoldMT",
    alignSelf: "center",
    color: COLORS.text,
  },
};

export default WorkoutScreen;
