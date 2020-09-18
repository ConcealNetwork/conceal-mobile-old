import React, { useContext, useState } from 'react';
import { Icon, Header, ButtonGroup } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import ConcealTextInput from '../components/ccxTextInput';
import GuideNavigation from '../helpers/GuideNav';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import Tips from 'react-native-guide-tips';
import Moment from 'moment';
import {
  maskAddress,
  getAspectRatio,
} from '../helpers/utils';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';

const Messages = () => {
  const { actions, state } = useContext(AppContext);
  const { setAppData } = actions;
  const { layout, messages, appData } = state;
  const filterButtons = ['All', 'Inbound', 'Outbound'];
  const { messagesLoaded } = layout;
  let isValidItem = false;
  let messageList = [];
  let counter = 0;

  // guide navigation state values
  const [guideState, setGuideState] = useState(null);
  const [guideNavigation] = useState(new GuideNavigation('messages', [
    'messageTypes',
    'messageSearch',
    'sendMessage'
  ]));

  if (messages) {
    Object.keys(messages).forEach(item => {
      messages[item].forEach(function (element) {
        isValidItem = true;
        counter++;

        // check if direction filter is set and the type of the message is appropriate
        if (((element.type == 'in') && (state.appData.messages.filterState == 2)) || ((element.type == 'out') && (state.appData.messages.filterState == 1))) {
          isValidItem = false;
        }

        // check if the text filter is set
        if (state.appData.messages.filterText && (element.message.toLowerCase().search(state.appData.messages.filterText.toLowerCase()) == -1)) {
          isValidItem = false;
        }

        if (isValidItem) {
          messageList.push({
            id: counter.toString(),
            address: item,
            message: element.message,
            timestamp: element.timestamp,
            type: element.type,
            sdm: element.sdm
          });
        }
      });
    });
  }

  // sort the array by timestamp
  messageList.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return Moment(b.timestamp).toDate() - Moment(a.timestamp).toDate();
  });


  const changeFilter = (selectedIndex) => {
    setAppData({
      messages: {
        filterState: selectedIndex
      }
    });
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        statusBarProps={{ translucent: false, backgroundColor: "#212529" }}
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={
          <View style={AppStyles.appHeaderWrapper}>
            <Text style={AppStyles.appHeaderText}>
              Messages
            </Text>
            <Icon
              onPress={() => {
                guideNavigation.reset();
                setGuideState(guideNavigation.start());
              }}
              name='md-help'
              type='ionicon'
              color='white'
              size={26 * getAspectRatio()}
            />
          </View>
        }
        rightComponent={messagesLoaded ?
          (
            <Tips
              position={'bottom'}
              visible={guideState == 'sendMessage'}
              textStyle={AppStyles.guideTipText}
              style={[AppStyles.guideTipContainer, styles.guideTipSendMessage]}
              tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowSendMessage]}
              text="Click on this button to send a message..."
              onRequestClose={() => setGuideState(guideNavigation.next())}
            >
              < Icon
                onPress={() => NavigationService.navigate('SendMessage')}
                name='md-add-circle-outline'
                type='ionicon'
                color='white'
                size={42 * getAspectRatio()}
              /></Tips>) : null}
      />
      <View style={styles.messagesWrapper}>
        <View>
          <Tips
            position={'bottom'}
            visible={guideState == 'messageTypes'}
            textStyle={AppStyles.guideTipText}
            tooltipArrowStyle={AppStyles.guideTipArrowTop}
            style={AppStyles.guideTipContainer}
            text="Here you can filter what type of messages you want to see"
            onRequestClose={() => setGuideState(guideNavigation.next())}
          >
            <ButtonGroup
              onPress={changeFilter}
              selectedIndex={state.appData.messages.filterState}
              buttons={filterButtons}
              buttonStyle={styles.filterButton}
              containerStyle={styles.filterButtons}
              innerBorderStyle={styles.filterButtonBorder}
              selectedButtonStyle={styles.filterButtonSelected}
            />
          </Tips>
        </View>
        <Tips
          position={'bottom'}
          visible={guideState == 'messageSearch'}
          textStyle={AppStyles.guideTipText}
          tooltipArrowStyle={AppStyles.guideTipArrowTop}
          style={AppStyles.guideTipContainer}
          text="Here you can search for a specific messages by text"
          onRequestClose={() => setGuideState(guideNavigation.next())}
        >
          <ConcealTextInput
            placeholder='Enter text to search...'
            value={state.appData.messages.filterText}
            onChangeText={(text) => {
              setAppData({ messages: { filterText: text } });
            }}
            rightIcon={
              <Icon
                onPress={() => setAppData({ messages: { filterText: null } })}
                name='md-trash'
                type='ionicon'
                color='white'
                size={32 * getAspectRatio()}
              />
            }
          />
        </Tips>
        {layout.userLoaded && messageList.length === 0
          ? (<View style={styles.emptyMessagesWrapper}>
            <Text style={styles.emptyMessagesText}>
              You have no messages currently. When someone will send you a message it will be visible here.
            </Text>
          </View>)
          : (<FlatList
            data={messageList}
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) =>
              <View style={(item.addr === appData.common.selectedWallet) ? [styles.flatview, styles.walletSelected] : styles.flatview}>
                <TouchableOpacity>
                  <View>
                    <Text style={styles.address}>{maskAddress(item.address)}</Text>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.timestamp}>{Moment(item.timestamp).format('LLLL')}</Text>
                    <Text style={item.type == 'in' ? [styles.type, styles.typein] : [styles.type, styles.typeout]}>{item.type == 'in' ? "Inbound" : "Outbound"}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />)
        }
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  icon: {
    color: 'orange'
  },
  flatList: {
    height: '100%',
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderColor: AppColors.concealBorderColor,
    borderRadius: 10,
    marginBottom: '5rem',
    borderWidth: 1,
    marginTop: '5rem',
    padding: '20rem',
  },
  address: {
    color: '#FFA500',
    fontSize: '14rem'
  },
  type: {
    fontSize: '14rem'
  },
  typein: {
    color: 'green',
  },
  typeout: {
    color: 'red',
  },
  message: {
    color: '#FFFFFF',
    fontSize: '18rem'
  },
  timestamp: {
    color: '#FFA500',
    fontSize: '14rem'
  },
  buttonContainer: {
    margin: '5rem'
  },
  messagesWrapper: {
    flex: 1,
    padding: '10rem'
  },
  emptyMessagesWrapper: {
    flex: 1,
    padding: '20rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyMessagesText: {
    fontSize: '18rem',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  msgDirection: {
    position: 'absolute',
    width: '32rem',
    height: '32rem',
    right: '10rem',
    top: '20rem',
  },
  filterButtons: {
    height: '45rem',
    borderColor: AppColors.concealBorderColor
  },
  filterButton: {
    borderColor: AppColors.concealOrange,
    backgroundColor: AppColors.concealBackground
  },
  filterButtonSelected: {
    borderColor: AppColors.concealOrange,
    backgroundColor: AppColors.concealOrange
  },
  filterButtonBorder: {
    color: AppColors.concealBorderColor
  },
  guideTipSendMessage: {
    left: '-130rem'
  },
  guideTipArrowSendMessage: {
    left: '97%'
  }
});

export default Messages;
