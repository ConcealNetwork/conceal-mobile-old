import React, { useEffect } from 'react';

import useAppState from './useAppState';
import NavigationService from '../helpers/NavigationService';
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
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Auth.setUsername(options.email);
    Auth.login(options)
      .then(res => {
        if (res.result === 'success') {
          logger.log('USER_LOGGED_IN...');
          dispatch({ type: 'USER_LOGGED_IN', password: options.password });
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: res.message, id });
        }
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      }
      )
      .catch(err => dispatch({ type: 'DISPLAY_MESSAGE', message: `ERROR ${err}`, id }));
  };

  const signUpUser = options => {
    const { userName, email, password, id } = options;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.signUpUser(userName, email, password)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow the instructions to activate your account.';
          // return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPassword = options => {
    const { email, id } = options;
    let message;
    Api.resetPassword(email)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow instructions to reset password.';
          Auth.logout();
          dispatch({ type: 'CLEAR_APP' });
          NavigationService.navigate('Login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
      });
  };

  const resetPasswordConfirm = options => {
    const { password, token, id } = options;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.resetPasswordConfirm(password, token)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = (<>Password successfully changed.<br />Please log in.</>);
          // return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
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
    Api.getUser()
      .then(res => dispatch({ type: 'USER_LOADED', user: res.message }))
      .catch(e => console.error(e));
  };

  const addContact = (contact, extras) => {
    const { label, address, paymentID, entryID, edit, id } = contact;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.addContact(label, address, paymentID, entryID, edit)
      .then(res => {
        if (res.result === 'success') {
          getUser();
          extras.forEach(fn => fn());
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        message && dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const deleteContact = contact => {
    const { entryID } = contact;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.deleteContact(entryID)
      .then(res => {
        if (res.result === 'success') {
          getUser();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        message && dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const check2FA = () => {
    logger.log('CHECKING 2FA...');
    let message;
    Api.check2FA()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: '2FA_CHECK', value: res.message.enabled });
          // if (!res.message.enabled) getQRCode();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const update2FA = (options, extras) => {
    logger.log('UPDATING 2FA...');
    const { twoFACode, enable } = options;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.update2FA(twoFACode, enable)
      .then(res => {
        if (res.result === 'success') {
          message = `QR Code ${enable ? 'enabled' : 'disabled'}.`;
          check2FA();
          extras.forEach(fn => fn());
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const createWallet = () => {
    logger.log('CREATING WALLET...');
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    Api.createWallet()
      .then(res => {
        if (res.result === 'success') {
          const address = res.message.wallet;
          dispatch({ type: 'CREATE_WALLET', address });
          getWallets();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        message && dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const getWallets = () => {
    logger.log('GETTING WALLETS...');
    const oldWallets = updatedState.current.wallets;
    let message;

    Api.getWallets()
      .then(res => {
        if (res.result === 'success') {
          const wallets = res.message.wallets;
          if (Object.keys(wallets).length > 0) {
            let selectedAddress = Object.keys(wallets)[0];

            Object.keys(oldWallets).forEach(function (key) {
              if (oldWallets[key].selected) { selectedAddress = key; }
              oldWallets[key].selected = false;
            });

            Object.keys(wallets).forEach(function (key) {
              wallets[key].addr = key;
            });

            if (wallets[selectedAddress]) {
              wallets[selectedAddress].selected = true;
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
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'WALLETS_LOADED' });
        dispatch({ type: 'APP_UPDATED' });
      });
  };

  const getWalletKeys = options => {
    const { e, address, code, id } = options;
    logger.log('GETTING WALLET KEYS...');
    e.preventDefault();
    const { wallets } = state;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    if (!wallets[address].keys) {
      Api.getWalletKeys(address, code)
        .then(res => {
          if (res.result === 'success') {
            dispatch({ type: 'SET_WALLET_KEYS', keys: res.message });
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = `ERROR ${err}` })
        .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
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
    Api.deleteWallet(address)
      .then(res => res.result === 'success' && dispatch({ type: 'DELETE_WALLET', address }))
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        getWallets();
        dispatch({ type: 'FORM_SUBMITTED', value: false });
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

  const sendPayment = (wallet, address, paymentID, amount, twoFA, password, callback) => {
    logger.log('SENDING PAYMENT...');
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.sendTx(wallet, address, paymentID, amount, '', twoFA, password)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'PAYMENT_SENT', res });
          if (callback) { callback(res) }
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: res.message });
          if (callback) { callback(res) }
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
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

