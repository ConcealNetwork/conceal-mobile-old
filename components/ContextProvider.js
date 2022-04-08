import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import ApiHelper from '../helpers/ApiHelper';
import AuthHelper from '../helpers/AuthHelper';
import { logger } from '../helpers/Logger';
import { showMessageDialog } from '../helpers/utils';

export const AppContext = React.createContext();
export const AuthContext = React.createContext();

const AppContextProvider = props => {
  const navigation = useNavigation();
  const { state, dispatch, updatedState } = props;
  const Auth = new AuthHelper(state.appSettings.apiURL);
  const Api = new ApiHelper({ Auth, state });
  const { wallet } = state;

  const getUser = () => {
    logger.log('GETTING USER...');
    let message;
    let msgType;
    Api.getUser()
      .then(res => { dispatch({ type: 'USER_LOADED', user: res.message }); })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        showMessageDialog(message, msgType);
      });
  };

  const getMessages = () => {
    logger.log('GETTING MESSAGES...');
    let message;
    let msgType;
    Api.getMessages()
      .then(res => { dispatch({ type: 'MESSAGES_LOADED', messages: res.message }); })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        showMessageDialog(message, msgType);
      });
  };

  const sendMessage = (msg, address, wallet, password) => {
    logger.log('SENDING MESSAGE...');
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    let msgType;
    Api.sendMessage(msg, address, wallet, null, password)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'MESSAGE_SENT', res });
          getWallets();
          getMessages();
          navigation.goBack(2);
          message = 'Message was successfully sent to the recipient';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const addContact = (contact, extras) => {
    const { label, address, paymentID, entryID } = contact;
    let message;
    let msgType;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.addContact(label, address, paymentID, entryID)
      .then(res => {
        if (res.result === 'success') {
          getUser();
          if (extras) extras.forEach(fn => fn());
          message = `Contact ${entryID ? 'edited' : 'added'} successfully`;
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const deleteContact = contact => {
    const { entryID } = contact;
    let message;
    let msgType;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.deleteContact(entryID)
      .then(res => {
        if (res.result === 'success') {
          getUser();
          message = 'Contact was deleted successfully';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const check2FA = () => {
    logger.log('CHECKING 2FA...');
    let message;
    let msgType;

    Api.check2FA()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: '2FA_CHECK', value: res.message.enabled });
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        showMessageDialog(message, msgType);
      });
  };

  const update2FA = (options, extras) => {
    logger.log('UPDATING 2FA...');
    const { twoFACode, enable } = options;
    let message;
    let msgType;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.update2FA(twoFACode, enable)
      .then(res => {
        if (res.result === 'success') {
          check2FA();
          if (extras) extras.forEach(fn => fn());
          message = `QR Code ${enable ? 'enabled' : 'disabled'}.`;
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const createWallet = () => {
    logger.log('CREATING WALLET...');
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    let msgType;
    Api.createWallet()
      .then(res => {
        if (res.result === 'success') {
          const address = res.message.wallet;
          dispatch({ type: 'CREATE_WALLET', address });
          message = 'Wallet was succesfully created';
          msgType = 'info';
          getWallets();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const getWallets = () => {
    logger.log('GETTING WALLETS...');
    let message = null;
    let msgType;
    Api.getWallets()
      .then(res => {
        if (res.result === 'success') {
          const oldWallets = updatedState.current.wallets;
          const wallets = res.message.wallets;

          if (Object.keys(wallets).length > 0) {
            Object.keys(wallets).forEach(function (key) {                            
              wallets[key].addr = key;
              if (wallets[key].default) { 
                dispatch({ type: 'SELECT_WALLET', key });
              }
            });
          }
          console.log("SELECT_WALLET", wallet);

          Object.keys(oldWallets).map(address =>
            !wallets[address] && dispatch({ type: 'DELETE_WALLET', address })
          );
          dispatch({ type: 'UPDATE_WALLETS', wallets });
        }
      })
      .catch(err => {
        message = `ERROR ${err}`
      })
      .finally(() => {
        dispatch({ type: 'WALLETS_LOADED' });
        dispatch({ type: 'APP_UPDATED' });
        showMessageDialog(message, msgType);
      });
  };

  const getWalletKeys = (address, share) => {
    logger.log('GETTING WALLET KEYS...');
    const { wallets } = state;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    if (!wallets[address].keys) {
      Api.getWalletKeys(address, null)
        .then(res => {
          if (res.result === 'success') {
            if (share) {
              dispatch({ type: 'SHARE_WALLET_KEYS', keys: res.message });
            } else {
              dispatch({ type: 'SET_WALLET_KEYS', keys: res.message });
            }
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = `ERROR ${err}` })
        .finally(() => {
          dispatch({ type: 'FORM_SUBMITTED', value: false });
          showMessageDialog(message);
        });
    }
  };

  const switchWallet = address => {
    logger.log(`SWITCHING WALLET ${address}...`);
    setDefaultWallet(address);
    dispatch({ type: 'SWITCH_WALLET', address });
    navigation.navigate('Wallet');
  };

  const deleteWallet = address => {
    logger.log(`DELETING WALLET ${address}...`);
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    let msgType;
    Api.deleteWallet(address)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'DELETE_WALLET', address });
          message = 'Wallet was succesfully deleted';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => {
        message = `ERROR ${err}`
      })
      .finally(() => {
        getWallets();
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const setDefaultWallet = address => {
    logger.log(`SETTING DEFAULT WALLET ${address}...`);
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    let msgType;
    Api.setDefaultWallet(address)
      .then(res => {
        if (res.result === 'success') {
          const wallets = updatedState.current.wallets;

          Object.keys(wallets).forEach(function (key) {
            wallets[key].default = (key === address);
          });

          dispatch({ type: 'SET_DEFAULT_WALLET', wallets });
          message = 'Default wallet was succesfully set';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        getWallets();
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const getBlockchainHeight = () => {
    logger.log('GETTING BLOCKCHAIN HEIGHT...');
    Api.getBlockchainHeight()
      .then(res => dispatch({ type: 'UPDATE_BLOCKCHAIN_HEIGHT', blockchainHeight: res.message.height }))
      .catch(err => { console.log(`ERROR ${err}`) })
  };

  const getMarketPrices = () => {
    logger.log('GETTING MARKET PRICES...');
    const { markets } = state;
    Object.keys(markets).forEach(market => {
      Api.getMarketPrices(markets[market].apiURL)
        .then(res => {
          dispatch({ type: 'UPDATE_MARKET', market, marketData: res })
        })
        .catch(err => { console.log(`ERROR ${err}`) })
    });
  };

  const getPrices = () => {
    logger.log('GETTING PRICES...');
    const { appSettings } = state;
    Api.getPrices(appSettings.coingeckoAPI)
      .then(res => dispatch({ type: 'UPDATE_PRICES', pricesData: res }))
      .catch(err => { console.log(`ERROR ${err}`) })
  };

  const sendPayment = (wallet, address, paymentID, amount, aMessage, password) => {
    logger.log('SENDING PAYMENT...');
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    let msgType;
    Api.sendTx(wallet, address, paymentID, amount, aMessage, null, password)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'PAYMENT_SENT', res });
          getWallets();
          navigation.goBack(2);
          message = 'Payment was successfully sent to the recipient';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const getDeposits = () => {
    logger.log('GETTING MESSAGES...');
    let message;
    let msgType;
    Api.getDeposits()
      .then(res => { dispatch({ type: 'DEPOSITS_LOADED', deposits: res.message.deposits }) })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        showMessageDialog(message, msgType);
      });
  };

  const createDeposit = (amount, term, wallet, password) => {
    logger.log('CREATING DEPOSIT...');
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    let msgType;
    Api.createDeposit(amount, term, wallet, null, password)
      .then(res => {
        if (res.result === 'success') {
          getDeposits();
          navigation.goBack(2);
          dispatch({ type: 'DEPOSIT_CREATED', res });
          message = 'Your deposit was successfully created. It may take a while for deposit to be shown in the list, since it needs to be confirmed first!';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => { console.log(err); message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const unlockDeposit = (id) => {
    logger.log('UNLOCKING DEPOSIT...');
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    let msgType;
    Api.unlockDeposit(id)
      .then(res => {
        if (res.result === 'success') {
          getDeposits();
          dispatch({ type: 'DEPOSIT_UNLOCKED', res });
          message = 'Your deposit was successfully unlocked';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => { console.log(err); message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessageDialog(message, msgType);
      });
  };

  const actions = {
    getUser,
    addContact,
    deleteContact,
    check2FA,
    update2FA,
    sendPayment,
    sendMessage,
    createWallet,
    getWallets,
    switchWallet,
    deleteWallet,
    setDefaultWallet,
    getWalletKeys,
    getDeposits,
    createDeposit,
    unlockDeposit,
  };


  useEffect(() => {
    if (state.user.loggedIn) {
      getUser();
      check2FA();
      getWallets();
      getMessages();
      getDeposits();
      getBlockchainHeight();
      getMarketPrices();
      getPrices();
    }
  }, [state.user.loggedIn]);

  useEffect(() => {
    const { appSettings, intervals, user, userSettings } = state;
    if (user.loggedIn && intervals.length === 0) {
      const appIntervals = [
        { fn: getWallets, time: userSettings.updateWalletsInterval },
        { fn: getMessages, time: userSettings.updateMessagesInterval },
        { fn: getBlockchainHeight, time: appSettings.updateBlockchainHeightInterval },
        { fn: getMarketPrices, time: appSettings.updateMarketPricesInterval },
        { fn: getPrices, time: appSettings.updateMarketPricesInterval },
      ];
      dispatch({ type: 'SET_INTERVALS', intervals: appIntervals });
    }
  }, [state.user.loggedIn, state.intervals]);

  return (
    <AppContext.Provider value={{ actions, dispatch, state }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default AppContextProvider;

