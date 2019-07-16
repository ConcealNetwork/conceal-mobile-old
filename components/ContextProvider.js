import React, { useEffect } from 'react';

import useAppState from './useAppState';
import NavigationService from '../helpers/NavigationService';
import { showMessage } from '../helpers/utils';
import AuthHelper from '../helpers/AuthHelper';
import ApiHelper from '../helpers/ApiHelper';
import { logger } from '../helpers/Logger';
export const AppContext = React.createContext();


const AppContextProvider = props => {
  const [state, dispatch, updatedState] = useAppState();
  const Auth = new AuthHelper(state.appSettings.apiURL);
  const Api = new ApiHelper({ Auth, state });

  const loginUser = options => {
    const { id } = options;
    if (options.twoFACode) {
      options.uuid = Expo.Constants.installationId;
    }
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Auth.setUsername(options.email);
    Auth.login(options)
      .then(res => {
        if (res.result === 'success') {
          logger.log('USER_LOGGED_IN...');
          dispatch({ type: 'USER_LOGGED_IN', password: options.password });
        } else {
          message = res.message;
        }
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      })
      .catch(err => showMessage(`ERROR ${err}`))
      .finally(() => {
        showMessage(message, msgType);
      });
  };

  const signUpUser = options => {
    const { userName, email, password, id } = options;
    let message;
    let msgType;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.signUpUser(userName, email, password)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow the instructions to activate your account.';
          msgType = "info";
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessage(message, msgType);
      });
  };

  const resetPassword = options => {
    const { email, id } = options;
    let message;
    let msgType;
    Api.resetPassword(email)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow instructions to reset password.';
          msgType = 'info';
          Auth.logout();
          dispatch({ type: 'CLEAR_APP' });
          NavigationService.navigate('Login');
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        showMessage(message, msgType);
      });
  };

  const resetPasswordConfirm = options => {
    const { password, token, id } = options;
    let message;
    let msgType;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.resetPasswordConfirm(password, token)
      .then(res => {

        if (res.result === 'success') {
          message = (<>Password successfully changed.<br />Please log in.</>);
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessage(message, msgType);
      });
  };

  const logoutUser = () => {
    logger.log('LOGGING OUT...');
    Auth.logout()
      .then(() => {
        dispatch({ type: 'CLEAR_APP' });
        NavigationService.navigate('Login');
      });
  };

  const getUser = () => {
    logger.log('GETTING USER...');
    let message;
    let msgType;
    Api.getUser()
      .then(res => dispatch({ type: 'USER_LOADED', user: res.message }))
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        showMessage(message, msgType);
      });
  };

  const addContact = (contact, extras) => {
    const { label, address, paymentID, entryID, edit, id } = contact;
    let message;
    let msgType;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.addContact(label, address, paymentID, entryID, edit)
      .then(res => {
        if (res.result === 'success') {
          getUser();
          if (extras) extras.forEach(fn => fn());
          message = 'Contact was added / edited successfully';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessage(message, msgType);
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
        showMessage(message, msgType);
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
        showMessage(message, msgType);
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
        showMessage(message, msgType);
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
        showMessage(message, msgType);
      });
  };

  const getWallets = () => {
    logger.log('GETTING WALLETS...');
    let message;
    let msgType;
    Api.getWallets()
      .then(res => {
        if (res.result === 'success') {
          const oldWallets = updatedState.current.wallets;
          const wallets = res.message.wallets;

          if (Object.keys(wallets).length > 0) {
            let selectedAddress = null;
            let defaultAddress = null;

            Object.keys(oldWallets).forEach(function (key) {
              if (oldWallets[key].selected) { selectedAddress = key; }
              oldWallets[key].selected = false;
            });

            Object.keys(wallets).forEach(function (key) {
              if (wallets[key].default) { defaultAddress = key; }
              wallets[key].addr = key;
            });

            if (selectedAddress) {
              wallets[selectedAddress].selected = true;
            } else if (defaultAddress) {
              wallets[defaultAddress].selected = true;
            } else {
              wallets[Object.keys(wallets)[0]].selected = true;
            }
          }
          Object.keys(oldWallets).map(address =>
            !wallets[address] && dispatch({ type: 'DELETE_WALLET', address })
          );
          dispatch({ type: 'UPDATE_WALLETS', wallets });
        } else {
          message = res.message;
          if (Object.keys(updatedState.current.wallets).length > 0) {
            dispatch({ type: 'DELETE_WALLETS' });
          }
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'WALLETS_LOADED' });
        dispatch({ type: 'APP_UPDATED' });
        showMessage(message, msgType);
      });
  };

  const getWalletKeys = (address, share) => {
    logger.log('GETTING WALLET KEYS...');
    const { wallets } = state;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    console.log(wallets);
    console.log(address);
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
          showMessage(message);
        });
    }
  };

  const switchWallet = address => {
    logger.log(`SWITCHING WALLET ${address}...`);
    const { wallets } = state;
    Object.keys(wallets).map(wallet => {
      wallets[wallet].selected = wallet === address;
    });
    dispatch({ type: 'UPDATE_WALLETS', wallets });
    NavigationService.navigate('Wallet');
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
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        getWallets();
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessage(message, msgType);
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
        showMessage(message, msgType);
      });
  };

  const getBlockchainHeight = () => {
    logger.log('GETTING BLOCKCHAIN HEIGHT...');
    Api.getBlockchainHeight()
      .then(res => dispatch({ type: 'UPDATE_BLOCKCHAIN_HEIGHT', blockchainHeight: res.message.height }))
      .catch(err => { message = `ERROR ${err}` })
  };

  const getMarketPrices = () => {
    logger.log('GETTING MARKET PRICES...');
    const { markets } = state;
    Object.keys(markets).forEach(market => {
      Api.getMarketPrices(markets[market].apiURL)
        .then(res => {
          dispatch({ type: 'UPDATE_MARKET', market, marketData: res })
        })
        .catch(err => { message = `ERROR ${err}` })
    });
  };

  const getPrices = () => {
    logger.log('GETTING PRICES...');
    const { appSettings } = state;
    Api.getPrices(appSettings.coingeckoAPI)
      .then(res => dispatch({ type: 'UPDATE_PRICES', pricesData: res }))
      .catch(err => { message = `ERROR ${err}` })
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
          NavigationService.navigate('Wallet');
          message = 'Payment was succesfully sent to the recipient';
          msgType = 'info';
        } else {
          message = res.message;
        }
      })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        showMessage(message, msgType);
      });
  };

  const setAppData = (appData) => {
    logger.log('SETTING APP DATA...');
    dispatch({ type: 'SET_APP_DATA', appData });
  };

  const getUsername = () => {
    return Auth.getUsername();
  };


  const actions = {
    loginUser,
    signUpUser,
    resetPassword,
    resetPasswordConfirm,
    logoutUser,
    getUser,
    addContact,
    deleteContact,
    check2FA,
    update2FA,
    sendPayment,
    createWallet,
    getWallets,
    switchWallet,
    deleteWallet,
    setDefaultWallet,
    getWalletKeys,
    setAppData,
    getUsername
  };

  useEffect(() => {
    Auth.loggedIn()
      .then(loggedIn => {
        if (loggedIn) {
          if (!state.user.loggedIn) dispatch({ type: 'USER_LOGGED_IN' });
          Auth.getToken()
            .then(token => {
              dispatch({ type: 'SET_TOKEN', token });
            });
        }
      });
  }, [state.user.loggedIn]);

  useEffect(() => {
    if (state.user.loggedIn && state.user.token) {
      getUser();
      check2FA();
      getWallets();
      getBlockchainHeight();
      getMarketPrices();
      getPrices();
    }
  }, [state.user.token]);

  useEffect(() => {
    const { appSettings, intervals, user, userSettings } = state;
    if (user.loggedIn && intervals.length === 0) {
      const appIntervals = [
        { fn: getWallets, time: userSettings.updateWalletsInterval },
        { fn: getBlockchainHeight, time: appSettings.updateBlockchainHeightInterval },
        { fn: getMarketPrices, time: appSettings.updateMarketPricesInterval },
        { fn: getPrices, time: appSettings.updateMarketPricesInterval },
      ];
      dispatch({ type: 'SET_INTERVALS', intervals: appIntervals });
    }
  }, [state.user.loggedIn, state.intervals]);

  useEffect(() => {
    if (state.layout.userLoaded && state.layout.walletsLoaded) {
      if (!state.layout.loginFinished) {
        NavigationService.navigate('Wallet');
        state.layout.loginFinished = true;
      }
    }
  }, [state.layout]);

  return (
    <AppContext.Provider value={{ actions, dispatch, state }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default AppContextProvider;

