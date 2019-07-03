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
    Auth.login(options)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'USER_LOGGED_IN' });
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: res.message, id });
        }
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      }
      )
      .catch(err => dispatch({ type: 'DISPLAY_MESSAGE', message: `ERROR ${err}`, id }));
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
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const getWallets = () => {
    logger.log('GETTING WALLETS...');
    let message;
    Api.getWallets()
      .then(res => {
        if (res.result === 'success') {
          const wallets = res.message.wallets;
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

  const deleteWallet = address => {
    logger.log('DELETING WALLET...');
    Api.deleteWallet(address)
      .then(res => res.result === 'success' && dispatch({ type: 'DELETE_WALLET', address }))
      .catch(e => console.error(e));
  };

  const getBlockchainHeight = () => {
    logger.log('GETTING BLOCKCHAIN HEIGHT...');
    Api.getBlockchainHeight()
      .then(res => dispatch({ type: 'UPDATE_BLOCKCHAIN_HEIGHT', blockchainHeight: res.message.height }))
      .catch(e => console.error(e));
  };

  const getMarketPrices = () => {
    logger.log('GETTING MARKET PRICES...');
    const { markets } = state;
    Object.keys(markets).forEach(market => {
      Api.getMarketPrices(markets[market].apiURL)
        .then(res => {
          dispatch({ type: 'UPDATE_MARKET', market, marketData: res })
        })
        .catch(e => console.error(e));
    });
  };

  const getPrices = () => {
    logger.log('GETTING PRICES...');
    const { appSettings } = state;
    Api.getPrices(appSettings.coingeckoAPI)
      .then(res => dispatch({ type: 'UPDATE_PRICES', pricesData: res }))
      .catch(e => console.error(e));
  };

  const sendPayment = (wallet, address, paymentID, amount) => {
    logger.log('SENDING PAYMENT...');
    Api.sendTx(wallet, address, paymentID, amount, '', null, 'password')
      .then(res => console.log(res))
      .catch(e => console.error(e));
  };

  const setAppData = (appData) => {
    logger.log('SETTING APP DATA...');
    dispatch({ type: 'SET_APP_DATA', appData });
  };

  const actions = {
    loginUser,
    logoutUser,
    getUser,
    check2FA,
    update2FA,
    sendPayment,
    createWallet,
    getWallets,
    deleteWallet,
    getWalletKeys,
    setAppData
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

