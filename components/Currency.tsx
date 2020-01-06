import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Button,
  RefreshControl,
  TouchableOpacity,
  Alert
} from "react-native";

import moment from "moment";
import Constants from "expo-constants";
import { NetInfo } from "react-native";

import { monoCurrencyFetch } from "../functions/fetches";
import currencies from "../dictionaries/currencies.json";

export default class Currency extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      result: [],
      refreshing: false,
      mounted: false
    };
  }

  componentDidMount() {
    const setMount = async () => {
      this.setState({
        mounted: true
      });
    };

    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({
          error: false
        });

        setMount().then(() => {
          if (this.state.mounted) {
            this.setState = this.setState.bind(this);
            monoCurrencyFetch(this.setState);
          }
        });
      } else {
        this.setState({
          error: true
        });
      }
    });
  }

  reload = () => {
    this.componentDidMount();
  };

  componentWillUnmount() {
    this.setState({
      mounted: false
    });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });

    const refresh = async () => {
      this.componentDidMount();
    };

    refresh().then(() => {
      this.setState({ refreshing: false });
    });
  };

  showDateSet = value => {
    Alert.alert(
      `Последняя дата обновления ${moment
        .unix(value)
        .format("DD.MM.YYYY HH:mm:ss")}`
    );
  };

  render() {
    const { error, isLoaded, result } = this.state;

    if (error) {
      return (
        <SafeAreaView style={{ marginTop: Constants.statusBarHeight }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={styles.error}>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>
                Произошла ошибка либо нет интернет соединения
              </Text>
              <Button title="Попробовать еще" onPress={this.reload} />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    } else if (!isLoaded) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      return (
        <SafeAreaView style={{ marginTop: Constants.statusBarHeight }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={styles.container}>
              {result.map((item: any, i) => {
                
                let { currencyCodeA, currencyCodeB } = item;

                const { rateBuy, rateSell, rateCross, date } = item;

                for (let [key, value] of Object.entries(currencies)) {
                  if (value === currencyCodeA) {
                    currencyCodeA = key;
                  } else if (value === currencyCodeB) {
                    currencyCodeB = key;
                  }
                }

                return (
                  <TouchableOpacity
                    style={styles.currContainer}
                    key={i}
                    onPress={() => this.showDateSet(date)}
                  >
                    <Text style={styles.currinfoMain}>
                      {currencyCodeA} / {currencyCodeB}
                    </Text>

                    {rateBuy ? (
                      <Text style={styles.currinfo}>
                        Покупка {parseFloat(rateBuy).toFixed(3)}
                      </Text>
                    ) : (
                      false
                    )}

                    {rateSell ? (
                      <Text style={styles.currinfo}>
                        Продажа {parseFloat(rateSell).toFixed(3)}
                      </Text>
                    ) : (
                      false
                    )}

                    {rateCross ? (
                      <Text style={styles.currinfo}>
                        Кросс-курс {parseFloat(rateCross).toFixed(3)}
                      </Text>
                    ) : (
                      false
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  error: {
    flexDirection: "column",
    padding: 30,
    flex: 1,
    justifyContent: "center",
    marginTop: "50%"
  },

  loader: {
    flexDirection: "row",
    padding: 10,
    flex: 1,
    justifyContent: "center"
  },

  h1: {
    marginTop: Constants.statusBarHeight + 20,
    fontSize: 30,
    textAlign: "center",
    marginBottom: "11%"
  },

  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "stretch",
    padding: 2
  },

  currName: {
    textAlign: "center",
    fontSize: 30
  },

  currContainer: {
    width: "50%",
    paddingTop: "16%",
    paddingBottom: "16%",
    backgroundColor: "#1f2227",
    borderStyle: "solid",
    borderColor: "#fff",
    borderWidth: 2
  },

  currinfoMain: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
    color: "#fff"
  },

  currinfo: {
    textAlign: "center",
    fontSize: 15,
    color: "#fff"
  }
});
