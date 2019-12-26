import React, { useContext } from 'react';
import { Icon, Header, ListItem, Overlay } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import ModalSelector from 'react-native-modal-selector';
import ConcealPinView from '../components/ccxPinView';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import AppConf from '../app.json';
import {
  Text,
  View,
  Picker,
  FlatList,
  ScrollView,
  StyleSheet
} from 'react-native';


const Settings = () => {
  const { actions, state } = useContext(AppContext);
  const { appData } = state;
  const { setAppData } = actions;
  const { logoutUser, check2FA } = actions;
  const { network, user, userSettings } = state;

  let pickerRef;

  const settingsList = [
    {
      value: user.name,
      title: 'User Name',
      icon: 'md-person'
    }, {
      value: user.email,
      title: 'Email',
      icon: 'md-mail'
    }, {
      value: network.blockchainHeight.toLocaleString(),
      title: 'Height',
      icon: 'md-pulse'
    }, {
      value: userSettings.twoFAEnabled ? 'Two Factor Authentication is ON' : 'Two Factor Authentication is OFF',
      title: 'Visit: "https://conceal.cloud" to change',
      icon: 'md-lock'
    }, {
      value: 'password',
      title: 'Authentication method',
      icon: 'md-lock',
      rightElement: function () {
        return (
          <ModalSelector
            data={[
              { key: 1, section: true, label: 'Available options' },
              { key: 2, label: 'Password' },
              { key: 3, label: 'PIN' }
            ]}
            ref={selector => { pickerRef = selector; }}
            cancelStyle={styles.pickerCancelButton}
            cancelTextStyle={styles.pickerCancelButtonText}
            optionContainerStyle={styles.pickerContainer}
            sectionTextStyle={styles.pickerSectionText}
            optionTextStyle={styles.pickerOptionText}
            customSelector={
              < Icon
                name='md-menu'
                type='ionicon'
                color='white'
                size={32 * getAspectRatio()}
                onPress={() => pickerRef.open()}
              />}
          />);
      }
    }, {
      value: AppConf.expo.version,
      title: 'Conceal Mobile version',
      icon: 'md-information'
    }
  ];

  const pickerData = [
    "Javascript",
    "Go",
    "Java",
    "Kotlin",
    "C++",
    "C#",
    "PHP"
  ];

  // key extractor for the list
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.value}
      subtitle={item.title}
      rightElement={item.rightElement}
      titleStyle={styles.settingsText}
      subtitleStyle={styles.settingsLabel}
      containerStyle={styles.settingsItem}
      onPress={item.onPress}
      leftIcon={<Icon
        name={item.icon}
        type='ionicon'
        color='white'
        size={32 * getAspectRatio()}
      />}
    />
  );

  if (userSettings.twoFAEnabled === null) {
    check2FA();
  }

  return (
    <View style={AppStyles.pageWrapper}>
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
        centerComponent={{ text: 'User Settings', style: AppStyles.appHeaderText }}
        rightComponent={< Icon
          onPress={logoutUser}
          name='md-log-out'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
      />
      <FlatList
        data={settingsList}
        style={styles.settingsList}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
      />
      <Overlay
        isVisible={state.appData.settings.patternVisible}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <ConcealPinView
            onComplete={(val, clear) => { alert(val) }}
          />
        </View>
      </Overlay>
    </View>
  )
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40'
  },
  settingsLabel: {
    fontSize: '12rem',
    color: AppColors.concealOrange
  },
  settingsText: {
    fontSize: '14rem',
    color: AppColors.concealTextColor
  },
  settingsList: {
    margin: '10rem',
    backgroundColor: AppColors.concealBackground
  },
  settingsItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground,
  },
  pickerCancelButton: {
    height: '45rem',
    borderWidth: 1,
    borderColor: AppColors.concealOrange,
    backgroundColor: AppColors.concealBackground
  },
  pickerCancelButtonText: {
    color: AppColors.concealTextColor,
    fontSize: '16rem',
    paddingTop: '2rem'
  },
  pickerContainer: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.concealBlack,
    backgroundColor: AppColors.concealBackground
  },
  pickerOptionText: {
    color: AppColors.concealTextColor
  },
  pickerSectionText: {
    color: AppColors.concealOrange
  }
});

export default Settings;
