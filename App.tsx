import React, { Component } from "react";
import { View } from "react-native";

import Currency from "./components/Currency";

class App extends Component<any, any> {
  render() {
    return (
      <View style={{ height: "100%" }}>
        <Currency />
      </View>
    );
  }
}

export default App;
