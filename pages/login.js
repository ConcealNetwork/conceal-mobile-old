import React from "react";
import appData from '../modules/appdata';
import { Appbar } from 'react-native-paper';
import ConcealLoader from '../components/ccxLoader';
import ConcealButton from '../components/ccxButton';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Alert } from "react-native";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loggingIn: false
    };
  }

  onAuthenticate = () => {
    const { navigate } = this.props.navigation;
    this.setState({ loggingIn: true });
    var selfPointer = this;

    appData.login("taegus.cromis@gmail.com", "philosophem", null, function (success) {
      if (success) {
        appData.dataWallets.fetchWallets(function (success) {
          selfPointer.setState({ loggingIn: false });

          if (success) {
            navigate("Wallet", appData.dataWallets.getDefaultWallet());
          }
        });
      } else {
        selfPointer.setState({ loggingIn: false });

        Alert.alert(
          'Alert Title',
          'We failed!!!',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      }
    });
  }

  render() {
    return (
      <View>
        <Appbar.Header style={styles.appHeader}>
          <Appbar.Content
            title="Login"
          />
        </Appbar.Header>
        <View style={styles.container}>
          <ConcealLoader loading={this.state.loggingIn} />
          <View style={styles.textHeader}>
            <Text style={styles.header}>Conceal Mobile</Text>
            <Text style={styles.welcomeBack}>Welcome back!</Text>
            <Text style={styles.singInToContinue}>Sign in to continue.</Text>
          </View>
          <View style={styles.loginContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder="Enter your email"
                keyboardType="email-address"
                underlineColorAndroid="transparent"
                onChangeText={email => this.setState({ email })}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder="Enter your password"
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                onChangeText={password => this.setState({ password })}
              />
            </View>

            <ConcealButton onPress={() => this.onAuthenticate()} text="SIGN IN" />
          </View>

          <TouchableHighlight
            style={styles.helpersContainer}
            onPress={() => this.onClickListener("restore_password")}
          >
            <Text style={styles.helperLabel}>
              Don't have an account?
              <Text style={styles.helperValue}> Sign Up</Text>
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.helpersContainer}
            onPress={() => this.onClickListener("register")}
          >
            <Text style={styles.helperLabel}>
              Forgot your password?
              <Text style={styles.helperValue}> Reset It</Text>
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: "#343a40"
  },
  container: {
    margin: 20,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#343a40",
    borderWidth: 1,
    backgroundColor: "#212529"
  },
  textHeader: {
    alignSelf: "flex-start"
  },
  header: {
    fontSize: 28,
    color: "#ffffff",
    marginBottom: 20
  },
  welcomeBack: {
    fontSize: 20,
    color: "#ffffff"
  },
  singInToContinue: {
    fontSize: 20,
    color: "#607ea1",
    marginBottom: 20
  },
  loginContainer: {
    marginBottom: 30,
    width: "100%"
  },
  inputContainer: {
    borderColor: "#495057",
    backgroundColor: "#212529",
    borderWidth: 1,
    height: 45,
    marginBottom: 20,
  },
  inputs: {
    color: "#607ea1",
    height: 45,
    marginLeft: 16
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 250
  },
  loginButton: {
    backgroundColor: "orange"
  },
  loginText: {
    color: "white"
  },
  helpersContainer: {
    height: 35
  },
  helperLabel: {
    color: "#ffffff"
  },
  helperValue: {
    marginLeft: 10,
    color: "orange"
  }
});
