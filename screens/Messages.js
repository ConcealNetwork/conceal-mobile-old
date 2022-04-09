import React, { useContext, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ButtonGroup, Header, Icon } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import Tips from 'react-native-guide-tips';
import ConcealTextInput from '../components/ccxTextInput';
import { AppContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import GuideNavigation from '../helpers/GuideNav';
import { getAspectRatio, maskAddress, } from '../helpers/utils';


const Messages = ({ navigation: { goBack, navigate } }) => {
  const { state } = useContext(AppContext);
  const { layout, messages, wallet } = state;
  const filterButtons = ['All', 'Inbound', 'Outbound'];
  const { messagesLoaded } = layout;
  let isValidItem = false;
  let messageList = [];
  let counter = 0;

  const [filterText, setFilterText] = useState(null);
  const [filterState, setFilterState] = useState(0);
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
        if (((element.type === 'in') && (filterState === 2)) || ((element.type === 'out') && (filterState === 1))) {
          isValidItem = false;
        }

        // check if the text filter is set
        if (filterText && (element.message.toLowerCase().search(filterText.toLowerCase()) === -1)) {
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

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement='left'
        statusBarProps={{ translucent: false, backgroundColor: "#212529" }}
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          containerStyle={AppStyles.leftHeaderIcon}
          onPress={() => goBack()}
          name='arrow-back-outline'
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
              visible={guideState === 'sendMessage'}
              textStyle={AppStyles.guideTipText}
              style={[AppStyles.guideTipContainer, styles.guideTipSendMessage]}
              tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowSendMessage]}
              text="Click on this button to send a message..."
              onRequestClose={() => setGuideState(guideNavigation.next())}
            >
              < Icon
                onPress={() => navigate('SendMessage')}
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
            visible={guideState === 'messageTypes'}
            textStyle={AppStyles.guideTipText}
            tooltipArrowStyle={AppStyles.guideTipArrowTop}
            style={AppStyles.guideTipContainer}
            text="Here you can filter what type of messages you want to see"
            onRequestClose={() => setGuideState(guideNavigation.next())}
          >
            <ButtonGroup
              onPress={i => setFilterState(i)}
              selectedIndex={filterState}
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
          visible={guideState === 'messageSearch'}
          textStyle={AppStyles.guideTipText}
          tooltipArrowStyle={AppStyles.guideTipArrowTop}
          style={AppStyles.guideTipContainer}
          text="Here you can search for a specific messages by text"
          onRequestClose={() => setGuideState(guideNavigation.next())}
        >
          <ConcealTextInput
            placeholder='Enter text to search...'
            value={filterText}
            onChangeText={(text) => { setFilterText(text) }}
            rightIcon={
              <Icon
                onPress={() => setFilterText(null) }
                name='md-trash'
                type='ionicon'
                color='white'
                size={32 * getAspectRatio()}
              />
            }
          />
        </Tips>
        {layout.userLoaded && messageList.length === 0
          ? <View style={styles.emptyMessagesWrapper}>
              <Text style={styles.emptyMessagesText}>
                You have no messages currently. When someone will send you a message it will be visible here.
              </Text>
            </View>
          : <FlatList
              data={messageList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())}
              style={styles.flatList}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) =>
                <View style={(item.addr === wallet.selected) ? [styles.flatview, styles.walletSelected] : styles.flatview}>
                  <TouchableOpacity>
                    <View>
                      <Text style={item.type === 'in' ? [styles.type, styles.typein] : [styles.type, styles.typeout]}>{item.type === 'in' ? "Inbound" : "Outbound"}</Text>
                      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                      {item.type === 'out'
                        ? <Text style={styles.address}>To: {maskAddress(item.address)}</Text>
                        : null
                      }
                      <Text style={styles.message}>{item.message}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
            />
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
