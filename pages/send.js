import React from "react";
import { Formik } from 'formik';
import { observer } from "mobx-react";
import appData from '../modules/appdata';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Appbar } from 'react-native-paper';
import ConcealButton from '../components/ccxButton';
import ConcealTextInput from '../components/ccxTextInput';
import { Alert, Keyboard, Text, View, StyleSheet } from "react-native";

export default class SendScreen extends React.Component {

  constructor(props) {
    super(props);

    this.data = this.props.navigation.state.params;
  }

  onGoBack = () => {
    const { goBack } = this.props.navigation;
    goBack();
  }

  render() {
    return (
      <View>
        <Appbar.Header style={styles.appHeader}>
          <Appbar.BackAction onPress={() => this.onGoBack()} />
          <Appbar.Content
            title="Send funds"
          />
        </Appbar.Header>
        <View style={styles.content}>
          <Formik
            initialValues={{ fromAddress: this.data.address }}
            onSubmit={values => {
              Alert.alert(JSON.stringify(values, null, 2));
              Keyboard.dismiss();
            }
            }>
            {({ handleChange, handleSubmit, values }) => (
              <View>
                <View style={styles.form}>
                  <ConcealTextInput
                    onChangeText={handleChange('toAddress')}
                    value={values.toAddress}
                    label="To"
                    placeholder="Address"
                  />
                  <ConcealTextInput
                    onChangeText={handleChange('ammount')}
                    value={values.ammount}
                    label="Amount"
                    placeholder="Amount"
                  />
                  <ConcealTextInput
                    onChangeText={handleChange('paymentID')}
                    value={values.paymentID}
                    label="Payment ID (Optional)"
                    placeholder="Payment ID"
                  />
                  <ConcealTextInput
                    onChangeText={handleChange('message')}
                    value={values.message}
                    label="Message (Optional)"
                    placeholder="Message"
                  />
                  <ConcealTextInput
                    onChangeText={handleChange('label')}
                    value={values.label}
                    label="Label (Optional)"
                    placeholder="Label"
                  />
                  <ConcealTextInput
                    onChangeText={handleChange('password')}
                    value={values.password}
                    label="Password"
                    placeholder="Password"
                  />
                </View>
                <ConcealButton onPress={handleSubmit} text="SEND" />
              </View>
            )}
          </Formik>
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
  form: {
    borderWidth: 1,
    borderColor: "#343a40"
  },
  content: {
    padding: 16
  }
});