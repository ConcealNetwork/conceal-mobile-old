import React, { useContext, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import { getAspectRatio, maskAddress } from '../helpers/utils';
import AuthCheck from './AuthCheck';


const SendMessageConfirm = ({ navigation: { goBack }, route }) => {
  const { state, actions } = useContext(AppContext);
  const { wallets, appSettings } = state;
  const currWallet = wallets[Object.keys(wallets).find(i => wallets[i].default)];

  const [showAuthCheck, setShowAuthCheck] = useState(false);
  const sendSummaryList = [];

  function addSummaryItem(value, title, icon) {
    sendSummaryList.push({
      value: value,
      title: title,
      icon: icon
    });
  }

  addSummaryItem(maskAddress(currWallet.addr), 'From address', 'md-mail');
  addSummaryItem(maskAddress(route.params?.address), 'To address', 'md-mail');
  addSummaryItem(route.params?.message, 'Message', 'md-mail');
  addSummaryItem(`${appSettings.defaultFee} CCX`, 'Transaction Fee', 'md-cash');

  const renderItem = ({ item }) =>
    <ListItem containerStyle={styles.summaryItem} key={item.value} onPress={item.onPress}>
      <Icon name={item.icon} type='ionicon' color='white' size={32 * getAspectRatio()} />
      <ListItem.Content>
        <ListItem.Title style={styles.summaryText}>{item.value}</ListItem.Title>
        <ListItem.Subtitle style={styles.summaryLabel}>{item.title}</ListItem.Subtitle>
      </ListItem.Content>
      {item.rightElement}
    </ListItem>

  const sendMessage = (password) => {
    actions.sendMessage(
      route.params?.message,
      route.params?.address,
      currWallet.addr,
      password
    );
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement='left'
        statusBarProps={{ translucent: false, backgroundColor: "#212529" }}
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => goBack()}
          name='arrow-back-outline'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Confirm sending', style: AppStyles.appHeaderText }}
      />
      <FlatList
        data={sendSummaryList}
        style={styles.summaryList}
        renderItem={renderItem}
        keyExtractor={item => item.title}
      />
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          onPress={() => setShowAuthCheck(true)}
          text="SEND"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => goBack()}
          text="CANCEL"
        />
      </View>
      <AuthCheck
        onSuccess={(password) => {
          setShowAuthCheck(false);
          sendMessage(password);
        }}
        onCancel={() => setShowAuthCheck(false)}
        showCheck={showAuthCheck}
      />
    </View>
  )
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  icon: {
    color: "orange"
  },
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: '10rem',
    marginBottom: '5rem',
    marginTop: '5rem',
    padding: '20rem',
  },
  sendInput: {
    marginTop: '10rem',
    marginBottom: '20rem'
  },
  password: {
    color: "#FFFFFF",
    fontSize: '18rem'
  },
  data: {
    color: "#AAAAAA"
  },
  sendSummary: {
    color: "#AAAAAA",
    backgroundColor: '#212529',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: '2rem',
    marginTop: '2rem',
    padding: '10rem',
    fontSize: '16rem'
  },
  buttonContainer: {
    margin: '5rem'
  },
  walletWrapper: {
    flex: 1,
    top: 0,
    left: '5rem',
    right: '5rem',
    bottom: '50rem',
    margin: '15rem',
    position: 'absolute',
    flexDirection: 'column'
  },
  sendSummaryWrapper: {
    margin: '10rem',
    marginTop: '20rem'
  },
  sendSummaryHighlight: {
    color: AppColors.concealOrange
  },
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  addressWrapper: {
    top: '10rem',
    left: '10rem',
    right: '10rem',
    bottom: '80rem',
    borderRadius: 10,
    position: 'absolute'
  },
  footer: {
    bottom: '10rem',
    left: '20rem',
    right: '20rem',
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
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  },
  summaryLabel: {
    color: AppColors.concealOrange,
    fontSize: '12rem'
  },
  summaryText: {
    color: AppColors.concealTextColor,
    fontSize: '14rem'
  },
  summaryList: {
    flex: 1,
    margin: '10rem',
    backgroundColor: AppColors.concealBackground
  },
  summaryItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    paddingTop: '5rem',
    paddingBottom: '5rem',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground,
  }
});


export default SendMessageConfirm;
