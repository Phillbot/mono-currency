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
  Alert,
  TextInput
} from "react-native";

import moment from "moment";
import Constants from "expo-constants";
import { NetInfo } from "react-native";

import { monoCurrencyFetch } from "../functions/fetches";
import { searchCurr } from "../functions/search";

export default class Currency extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      result: [],
      refreshing: false,
      mounted: false,
      filterData: []
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

  search = (e: {}) => {
    this.setState = this.setState.bind(this);
    searchCurr(e, this.setState, this.state.result);
  };

  render() {
    const { error, isLoaded, result, filterData } = this.state;

    const currs = filterData.length > 0 ? filterData : result;

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
            <Text style={styles.h1}>Фильтр курсов валют</Text>

            <TextInput
              style={styles.search}
              onChangeText={text => this.search(text)}
            />

            <View style={styles.container}>
              {currs.map((item: any, i) => {
                const {
                  currencyCodeA,
                  currencyCodeB,
                  rateBuy,
                  rateSell,
                  rateCross,
                  date
                } = item;

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
    marginTop: Constants.statusBarHeight + 10,
    fontSize: 22,
    textAlign: "center",
    marginBottom: "5%"
  },

  search:{
    height:40,
    marginBottom:20,
    marginLeft:"auto",
    marginRight:"auto",
    borderBottomColor:"grey",
    borderWidth: 1,
    width:"90%",
  
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
    width: "33.3%",
    paddingTop: "12%",
    paddingBottom: "12%",
    backgroundColor: "#1f2227",
    borderStyle: "solid",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius:25
  },

  currinfoMain: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 12,
    color: "#fff"
  },

  currinfo: {
    textAlign: "center",
    fontSize: 13,
    color: "#fff"
  }
});
