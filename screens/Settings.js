import React, { useContext, useState, useEffect } from 'react';
import { Input, Icon, Header, ListItem, Overlay } from 'react-native-elements';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import ModalSelector from 'react-native-modal-selector';
import ConcealPinView from '../components/ccxPinView';
import { showMessageDialog } from '../helpers/utils';
import localStorage from '../helpers/LocalStorage';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import AppConf from '../app.json';
import PinSetup from './PinSetup';
import FgpSetup from './FgpSetup';
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

  // our hook into the state of the function component for the authentication mode
  const { value: password, bind: bindPassword } = useFormInput('');
  const [authMode, setAuthMode] = useState(localStorage.get('auth_method', 'password'));
  const [showFgpModal, setShowFgpModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
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
      title: `Authentication method: "${localStorage.get('auth_method', 'password')}"`,
      icon: 'md-lock',
      rightElement: function () {
        return (
          <ModalSelector
            data={[
              { key: 1, section: true, label: 'Available options' },
              { key: 2, value: "password", label: 'Password' },
              { key: 3, value: "biometric", label: 'Biometric' },
              { key: 4, value: "pin", label: 'PIN' }
            ]}
            ref={selector => { pickerRef = selector; }}
            cancelStyle={styles.pickerCancelButton}
            cancelTextStyle={styles.pickerCancelButtonText}
            optionContainerStyle={styles.pickerContainer}
            sectionTextStyle={styles.pickerSectionText}
            optionTextStyle={styles.pickerOptionText}
            onChange={(option) => {
              localStorage.set('auth_method', option.value);
              setAuthMode(option.value);

              if (option.value == "pin") {
                setShowPinModal(true);
              } else if (option.value == "biometric") {
                setShowFgpModal(true);
              }
            }}
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
        isVisible={showPinModal}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <PinSetup
            onSave={(data) => {
              setShowPinModal(false);
              showMessageDialog("Pin was successfully set.", "info");
              localStorage.set('lock_password', data.passData);
              localStorage.set('lock_pin', data.pinData);
            }}
            onCancel={() => setShowPinModal(false)}
          />
        </View>
      </Overlay>
      <Overlay
        isVisible={showFgpModal}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <FgpSetup
            onSave={(data) => {
              setShowFgpModal(false);
              showMessageDialog("Fingerprint was successfully set.", "info");
              localStorage.set('lock_password', data.passData);
              localStorage.set('lock_fgp', data.fgpData);
            }}
            onCancel={() => setShowFgpModal(false)}
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
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
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
  },
  passwordInput: {
    marginTop: '30rem',
    marginBottom: '50rem'
  }
});

export default Settings;
