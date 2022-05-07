import { Text, View, Vibration } from "react-native";
import React, { Component } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLORS } from "../../styles/colors";
import { CONSTANTS } from "../../styles/constants";
import PropTypes from "prop-types";

export class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerValue: this.props.counterValue,
      timerEnd: 0,
    };
    this.timerStarted = false;
  }

  startTimer() {
    this.setState(
      { timerEnd: Date.now() / 1000 + this.state.timerValue },
      () => {
        this.interval = setInterval(
          () =>
            this.setState({
              timerValue: Math.round(this.state.timerEnd - Date.now() / 1000),
            }),
          995
        );
      }
    );
  }

  componentDidUpdate() {
    if (this.state.timerValue <= 0 && this.timerStarted) {
      Vibration.vibrate();
      clearInterval(this.interval);
      this.timerStarted = false;
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.timerStarted = false;
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.counterTextStyle}>
          {this.state.timerValue}
          {this.props.isTimer ? "s" : ""}
        </Text>
        <BouncyCheckbox
          {...styles.checkboxStyle}
          text={this.props.text}
          onPress={(isChecked) => {
            if (this.props.isTimer && isChecked && !this.timerStarted) {
              this.startTimer();
              this.timerStarted = true;
            } else if (this.props.isTimer && !isChecked) {
              clearInterval(this.interval);
              this.setState({ timerValue: this.props.counterValue });
              this.timerStarted = false;
            }
          }}
        />
      </View>
    );
  }
}

Checkbox.propTypes = {
  counterValue: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  isTimer: PropTypes.bool.isRequired,
};

const styles = {
  viewStyle: {
    paddingLeft: 5,
    flexDirection: "row",
    height: 50,
    borderColor: COLORS.border,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: -1,
  },
  counterTextStyle: {
    width: 55,
    fontSize: 20,
    margin: 5,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    color: COLORS.text,
    borderColor: COLORS.border,
    borderWidth: CONSTANTS.borderWidth,
  },
  checkboxStyle: {
    disableText: false,
    style: {
      width: "100%",
      paddingLeft: 5,
      paddingRight: 5,
      borderColor: COLORS.border,
      borderWidth: CONSTANTS.borderWidth,
    },
    size: 40,
    fillColor: COLORS.checkbox,
    unfillColor: COLORS.background,
    iconImageStyle: {
      height: 20,
      width: 20,
    },
    textStyle: {
      fontFamily: "Arial",
      color: COLORS.text,
      fontSize: 20,
      margin: 0,
    },
    bounceFriction: 10,
  },
};

export default Checkbox;
