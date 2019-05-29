import { Dialog, Paragraph, Portal, Avatar, IconButton, Colors } from 'react-native-paper';
import { Provider as PaperProvider } from 'react-native-paper';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import ConcealTextInput from '../components/ccxTextInput';
import { maskAddress } from '../src/helpers/utils';
import ConcealButton from '../components/ccxButton';
import appData from '../modules/appdata';
import { observer } from "mobx-react";
import { Formik } from 'formik';
import Moment from "moment";
import React from "react";
import {
  Text,
  View,
  Alert,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";

const dialogTheme = {
  colors: {
    primary: "#FFA500"
  }
};

@observer
export default class WalletScreen extends React.Component {

  constructor(props) {
    super(props);

    this.data = {};
    this.wallets = appData.dataWallets.getWallets();

    if (this.wallets.length > 0) {
      this.data = this.wallets[0];
      console.log(this.data);
    }

    this.state = { dialogVisible: false };
  }

  onGoBack = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  onShowSettings = () => {
    const { navigate } = this.props.navigation;
    navigate("Wallets", {})
  };

  _showDialog = () => {
    console.log("show");
    this.setState({ dialogVisible: true });
  };

  _hideDialog = () => {
    console.log("hide");
    this.setState({ dialogVisible: false });
  };

  render() {
    return (
      <PaperProvider>
        <View style={styles.accountOverview}>
          <Text style={styles.worthDollars}>$ 65.22</Text>
          <Text style={styles.ammountCCX}>{this.data.balance} CCX</Text>
          <Text style={styles.worthBTC}>{'\u20BF'} 0.002345678</Text>
          <Avatar.Image style={styles.Avatar} size={52} source={require('../assets/taegus.png')} />
          <IconButton
            size={42}
            icon="more-horiz"
            color={Colors.white}
            style={styles.iconSettings}
            onPress={() => this.onShowSettings()}
          />
        </View>
        <Text style={styles.txsText}>Transactions</Text>
        <View style={styles.transactionsWrapper}>
          <FlatList
            data={this.data.transactions}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              <View style={styles.flatview}>
                <Text style={styles.dataTimestamp}>{Moment(item.timestamp).format('LLLL')}</Text>
                <Text style={styles.dataAmmount}>{item.amount} CCX (fee: {item.fee})</Text>
                <Text style={styles.dataAddress}>{maskAddress(item.address)}</Text>

                <IconButton
                  size={24}
                  icon={item.type === 'received' ? "arrow-downward" : "arrow-upward"}
                  color={item.type === 'received' ? Colors.green500 : Colors.red500}
                  style={styles.txDirection}
                  onPress={() => console.log('Pressed')}
                />
              </View>
            }
            keyExtractor={item => item.hash}
          />
        </View>
        <View style={styles.footer}>
          <ConcealButton style={[styles.footerBtn, styles.footerBtnLeft]} onPress={() => this._showDialog()} text="SEND" />
          <ConcealButton style={[styles.footerBtn, styles.footerBtnRight]} onPress={() => console.log('Pressed')} text="RECEIVE" />
        </View>
        <Portal>
          <Dialog visible={this.state.dialogVisible} onDismiss={this._hideDialog} style={styles.sendDialog}>
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
                        keyboardType="numeric"
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
          </Dialog>
        </Portal>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },
  worthDollars: {
    color: "#FFFFFF",
    fontSize: 14
  },
  ammountCCX: {
    color: "#FFA500",
    fontSize: 24,
    margin: 5
  },
  worthBTC: {
    color: "#FFFFFF",
    fontSize: 14
  },
  accountOverview: {
    margin: 20,
    padding: 25,
    height: 125,
    top: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212529"
  },
  footer: {
    bottom: 10,
    left: 20,
    right: 20,
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1
  },
  footerBtnRight: {
    marginLeft: 5
  },
  footerBtnLeft: {
    marginRight: 5
  },
  Avatar: {
    position: 'absolute',
    right: 10
  },
  iconSettings: {
    position: 'absolute',
    width: 42,
    height: 42,
    left: 10
  },
  transactionsWrapper: {
    top: 215,
    left: 20,
    right: 20,
    bottom: 70,
    borderRadius: 10,
    position: 'absolute'
  },
  dataTimestamp: {
    color: "#FFFFFF",
    fontSize: 14
  },
  dataAmmount: {
    color: "#FFFFFF",
    fontSize: 20
  },
  dataAddress: {
    color: "#FFA500",
    fontSize: 14
  },
  txsText: {
    color: "#FFFFFF",
    fontSize: 18,
    margin: 20
  },
  txDirection: {
    position: 'absolute',
    width: 24,
    height: 24,
    right: 10,
    top: 10
  },
  sendDialog: {
    backgroundColor: "#212529",
    borderColor: "#495057",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10
  }
});
