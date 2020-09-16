import { Icon, Header, ListItem } from 'react-native-elements';
import React, { useContext, useState } from "react";
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import { getDepositInterest } from '../helpers/utils';
import { Col, Row, Grid } from "react-native-easy-grid";
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import AuthCheck from './AuthCheck';
import Moment from 'moment';
import {
  getAspectRatio,
  format6Decimals
} from '../helpers/utils';
import {
  Text,
  View,
  FlatList,
} from "react-native";

const CreateDepositConfirm = () => {
  const { state, actions } = useContext(AppContext);
  const { wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  const [showAuthCheck, setShowAuthCheck] = useState(false);
  const sendSummaryList = [];

  function addSummaryItem(value, title, icon) {
    sendSummaryList.push({
      value: value,
      title: title,
      icon: icon
    });
  }

  let totalAmount = parseFloat(appData.createDeposit.amount);
  totalAmount = totalAmount + 0.0001;

  // calculate the interest class from the data
  let interestClass = ((appData.createDeposit.duration - 1) * 3) + Math.min(Math.floor(parseFloat(appData.createDeposit.amount) / 10000) + 1, 3)

  addSummaryItem(`${totalAmount.toLocaleString(undefined, format6Decimals)} CCX`, 'You are depositing', 'md-cash');
  addSummaryItem(`${getDepositInterest(appData.createDeposit.amount, appData.createDeposit.duration).toLocaleString(undefined, format6Decimals)} CCX`, 'Interest you will earn', 'md-cash');
  addSummaryItem(`${appData.createDeposit.duration} month${state.appData.createDeposit.duration > 1 ? 's' : ''}`, 'For a duration of', 'md-clock');
  addSummaryItem('0.0001 CCX', 'Transaction Fee', 'md-cash');

  // key extractor for the list
  const keyExtractor = (item, index) => index.toString();

  const renderListItem = ({ item }) => (
    <ListItem
      title={item.value}
      subtitle={item.title}
      titleStyle={styles.summaryText}
      subtitleStyle={styles.summaryLabel}
      containerStyle={styles.summaryItem}
      leftIcon={<Icon
        name={item.icon}
        type='ionicon'
        color='white'
        size={32 * getAspectRatio()}
      />}
    />
  );

  const createDeposit = (password) => {
    let currentTS = Moment();
    var depositTS = Moment(currentTS).add(state.appData.createDeposit.duration, 'M');
    let durationBlocks = Moment.duration(depositTS.diff(currentTS)).asMinutes() / 2;

    // call the API with the correct parameters (duration is in number of blocks, each block being 2 min)
    actions.createDeposit(state.appData.createDeposit.amount, durationBlocks, currWallet.addr, password);
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Confirm sending', style: AppStyles.appHeaderText }}
      />
      <View style={styles.contentWrapper}>
        <FlatList
          data={sendSummaryList}
          style={styles.summaryList}
          renderItem={renderListItem}
          keyExtractor={keyExtractor}
        />
        <Grid style={styles.interestGrid}>
          <Row style={styles.rowHeader}>
            <Col style={styles.colHeader}>
              <Text style={styles.headerText}>Month</Text>
            </Col>
            <Col style={styles.colHeader}>
              <Text style={styles.headerText}>Tier 1</Text>
            </Col>
            <Col style={styles.colHeader}>
              <Text style={styles.headerText}>Tier 2</Text>
            </Col>
            <Col style={styles.colHeader}>
              <Text style={styles.headerText}>Tier 3</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>1</Text>
            </Col>
            <Col style={(interestClass != 1) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>0.24</Text>
            </Col>
            <Col style={(interestClass != 2) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>0.33</Text>
            </Col>
            <Col style={(interestClass != 3) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>0.41</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>2</Text>
            </Col>
            <Col style={(interestClass != 4) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>0.50</Text>
            </Col>
            <Col style={(interestClass != 5) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>0.67</Text>
            </Col>
            <Col style={(interestClass != 6) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>0.83</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>3</Text>
            </Col>
            <Col style={(interestClass != 7) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>0.78</Text>
            </Col>
            <Col style={(interestClass != 8) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>1.03</Text>
            </Col>
            <Col style={(interestClass != 9) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>1.28</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>4</Text>
            </Col>
            <Col style={(interestClass != 10) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>1.07</Text>
            </Col>
            <Col style={(interestClass != 11) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>1.40</Text>
            </Col>
            <Col style={(interestClass != 12) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>1.73</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>5</Text>
            </Col>
            <Col style={(interestClass != 13) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>1.38</Text>
            </Col>
            <Col style={(interestClass != 14) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>1.79</Text>
            </Col>
            <Col style={(interestClass != 15) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>2.21</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>6</Text>
            </Col>
            <Col style={(interestClass != 16) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>1.70</Text>
            </Col>
            <Col style={(interestClass != 17) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>2.20</Text>
            </Col>
            <Col style={(interestClass != 18) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>2.70</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>7</Text>
            </Col>
            <Col style={(interestClass != 19) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>2.04</Text>
            </Col>
            <Col style={(interestClass != 20) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>2.63</Text>
            </Col>
            <Col style={(interestClass != 21) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>3.21</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>8</Text>
            </Col>
            <Col style={(interestClass != 22) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>2.40</Text>
            </Col>
            <Col style={(interestClass != 23) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>3.07</Text>
            </Col>
            <Col style={(interestClass != 24) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>3.73</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>9</Text>
            </Col>
            <Col style={(interestClass != 25) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>2.78</Text>
            </Col>
            <Col style={(interestClass != 26) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>3.53</Text>
            </Col>
            <Col style={(interestClass != 27) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>4.28</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>10</Text>
            </Col>
            <Col style={(interestClass != 28) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>3.17</Text>
            </Col>
            <Col style={(interestClass != 29) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>4.00</Text>
            </Col>
            <Col style={(interestClass != 30) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>4.83</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>11</Text>
            </Col>
            <Col style={(interestClass != 31) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>3.58</Text>
            </Col>
            <Col style={(interestClass != 32) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>4.49</Text>
            </Col>
            <Col style={(interestClass != 33) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>5.41</Text>
            </Col>
          </Row>
          <Row style={styles.rowData}>
            <Col style={styles.colData}>
              <Text style={styles.dataText}>12</Text>
            </Col>
            <Col style={(interestClass != 34) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>4.00</Text>
            </Col>
            <Col style={(interestClass != 35) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>5.00</Text>
            </Col>
            <Col style={(interestClass != 36) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>6.00</Text>
            </Col>
          </Row>
        </Grid>
        <View style={styles.footer}>
          <ConcealButton
            style={[styles.footerBtn, styles.footerBtnLeft]}
            onPress={() => setShowAuthCheck(true)}
            text="CREATE"
          />
          <ConcealButton
            style={[styles.footerBtn, styles.footerBtnRight]}
            onPress={() => NavigationService.goBack()}
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
  sendSummaryWrapper: {
    margin: '10rem',
    marginTop: '20rem'
  },
  sendSummaryHighlight: {
    color: AppColors.concealOrange
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
  },
  interestGrid: {
    marginBottom: '10rem',
    marginTop: '10rem',
    flexGrow: 1.6
  },
  rowHeader: {
    backgroundColor: AppColors.concealOrange,
    alignItems: 'center'
  },
  colHeader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colData: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  colSelected: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.concealOrange
  },
  headerText: {
    fontSize: '16rem',
    color: '#FFFFFF'
  },
  dataText: {
    fontSize: '14rem',
    color: '#FFFFFF'
  }
});

export default CreateDepositConfirm;