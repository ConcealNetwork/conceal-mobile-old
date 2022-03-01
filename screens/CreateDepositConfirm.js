import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View, } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import InterestTable from '../components/InterestTable';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import GuideNavigation from '../helpers/GuideNav';
import { format6Decimals, getAspectRatio, getDepositInterest, parseLocaleNumber } from '../helpers/utils';
import AuthCheck from './AuthCheck';

const CreateDepositConfirm = ({ navigation: { goBack } }) => {
  const { state, actions } = useContext(AppContext);
  const { wallets, appData, appSettings } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  const [showAuthCheck, setShowAuthCheck] = useState(false);
  const sendSummaryList = [];

  const addSummaryItem = (value, title, icon) => {
    sendSummaryList.push({
      value: value,
      title: title,
      icon: icon
    });
  };

  // calculate the interest class from the data
  const interestClass = ((appData.createDeposit.duration - 1) * 3) + Math.min(Math.floor(parseLocaleNumber(appData.createDeposit.amount, true) / 10000) + 1, 3)

  addSummaryItem(`${parseLocaleNumber(state.appData.createDeposit.amount, true).toLocaleString(undefined, format6Decimals)} CCX`, 'You are depositing', 'md-cash');
  addSummaryItem(`${getDepositInterest(parseLocaleNumber(appData.createDeposit.amount, true), appData.createDeposit.duration).toLocaleString(undefined, format6Decimals)} CCX`, 'Interest you will earn', 'md-cash');
  addSummaryItem(`${appData.createDeposit.duration} month${state.appData.createDeposit.duration > 1 ? 's' : ''}`, 'For a duration of', 'md-clock');
  addSummaryItem(`${appSettings.defaultFee} CCX`, 'Transaction Fee', 'md-cash');

  const renderListItem = ({ item }) => (
    <ListItem containerStyle={styles.settingsItem} key={item.value} onPress={item.onPress}>
      <Icon name={item.icon} type='ionicon' color='white' size={32 * getAspectRatio()} />
      <ListItem.Content>
        <ListItem.Title style={styles.settingsText}>{item.value}</ListItem.Title>
        <ListItem.Subtitle style={styles.settingsLabel}>{item.title}</ListItem.Subtitle>
      </ListItem.Content>
      {item.rightElement}
    </ListItem>
  );

  // guide navigation state values
  const [guideState, setGuideState] = useState(null);
  const [guideNavigation] = useState(new GuideNavigation('createDeposit', [
    'summary', 'interest', 'create', 'cancel'
  ]));

  const createDeposit = (password) => {
    let durationBlocks = appSettings.blocksPerMonth * state.appData.createDeposit.duration;
    // call the API with the correct parameters (duration is in number of blocks, each block being 2 min)
    actions.createDeposit(parseLocaleNumber(state.appData.createDeposit.amount, true), durationBlocks, currWallet.addr, password);
  }

  // fire on mount
  useEffect(() => {
    setTimeout(() => {
      setGuideState(guideNavigation.start());
    }, 100);
  }, []);

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
        centerComponent={{ text: 'Confirm desposit creation', style: AppStyles.appHeaderText }}
      />
      <View style={styles.contentWrapper}>
        <FlatList
          data={sendSummaryList}
          style={styles.summaryList}
          renderItem={renderListItem}
          keyExtractor={item => item.title}
        />
        <InterestTable
          interestClass={interestClass}
        />
        <View style={styles.footer}>
          <ConcealButton
            style={[styles.footerBtn, styles.footerBtnLeft]}
            onPress={() => setShowAuthCheck(true)}
            text="CREATE"
          />
          <ConcealButton
            style={[styles.footerBtn, styles.footerBtnRight]}
            onPress={() => goBack()}
            text="CANCEL"
          />
        </View>
      </View>
      <AuthCheck
        onSuccess={(password) => {
          setShowAuthCheck(false);
          createDeposit(password);
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
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgb(40, 45, 49)'
  },
  icon: {
    color: "orange"
  },
  contentWrapper: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    padding: '10rem',
    flexGrow: 1
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
  data: {
    color: "#AAAAAA"
  },
  buttonContainer: {
    margin: '5rem'
  },
  footer: {
    flexDirection: 'row'
  },
  footerBtn: {
    flex: 1,
  },
  footerBtnRight: {
    marginLeft: '5rem',
    width: '100%'
  },
  footerBtnLeft: {
    marginRight: '0rem',
    width: '100%'
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
    marginTop: '10rem',
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

export default CreateDepositConfirm;
