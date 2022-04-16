import { Text, View } from "react-native";
import React, { Component } from "react";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { COLORS } from "../styles/colors";
import PropTypes from "prop-types";

export class Title extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <View style={{ marginTop: getStatusBarHeight() }}></View>
        <Text style={[styles.textStyle, styles.titleText]}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

Title.propTyes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

const styles = {
  titleText: {
    marginTop: 10,
    marginBottom: 0,
  },
  textStyle: {
    fontSize: 25,
    fontFamily: "Arial-BoldMT",
    alignSelf: "center",
    color: COLORS.text,
  },
};

export default Title;
