import { useReducer, useRef } from 'react';
import mergeJSON from 'merge-json';
import { shareContent } from '../helpers/utils';
import { appSettings } from '../constants/appSettings';
import { logger } from '../helpers/Logger';

const useAppState = () => {
  const initialState = {
    appSettings,
    intervals: [],
    layout: {
      appLoaded: false,
      editContactData: {},
      formSubmitted: false,
      lastUpdate: new Date(),
      message: {},
      qrCodeUrl: '',
      redirectToReferrer: false,
      sendTxResponse: null,
      userLoaded: false,
      walletsLoaded: false,
      messagesLoaded: false,
    },
    markets: {
      stex: {
        apiURL: 'https://api.wallet.conceal.network/api/stex/status',
        ask: 0,
        bid: 0,
        volume: 0
      },
      tradeogre: {
        apiURL: 'https://tradeogre.com/api/v1/ticker/BTC-CCX',
        ask: 0,
        bid: 0,
        volume: 0
      },
    },
    network: {
      blockchainHeight: 0
    },
    prices: {
      usd: 0,
      btc: 0,
      usd_24h_vol: 0,
      usd_market_cap: 0,
      btc_24h_change: 0,
      usd_24h_change: 0
    },
    user: {
      addressBook: [],
      loggedIn: false,
      userName: '',
      password: ''
    },
    userSettings: {
      minimumPasswordLength: 8,
      qrCodeURL: '',
      twoFACode: '',
      twoFAEnabled: null,
      updateWalletsInterval: 60,  // seconds
      updateMessagesInterval: 60,  // seconds
    },
    wallets: {},
    appData: {
      sendScreen: {
        sendConfirmVisible: false,
        securePasswordEntry: true
      },
      messages: {
        filterText: null,
        filterState: 0
      },
      sendMessage: {
        securePasswordEntry: true
      },
      addressEntry: {
        label: null,
        address: null,
        paymentId: null,
        entryId: null,
        headerText: null
      },
      addressBook: {
        filterText: null
      },
      searchAddress: {
        addrListVisible: false,
        filterText: null
      },
      login: {
        userName: '',
        signUpVisible: false,
        resetPasswordVisible: false
      },
      common: {
        selectedWallet: null
      }
    }
  };
  const updatedState = useRef(initialState);

  const reducer = (state, action) => {
    let result = {};
    switch (action.type) {
      case 'USER_LOGGED_IN':
        if (!state.user.loggedIn) logger.log('LOGGING IN USER...');
        result = {
          ...state,
          user: {
            ...state.user,
            loggedIn: true
          },
        };
        break;
      case 'SET_TOKEN':
        result = {
          ...state,
          user: {
            ...state.user,
            token: action.token,
          },
        };
        break;
      case 'USER_LOADED':
        result = {
          ...state,
          layout: {
            ...state.layout,
            userLoaded: true,
          },
          user: {
            ...state.user,
            ...action.user,
          },
        };
        break;
      case 'MESSAGES_LOADED':
        result = {
          ...state,
          layout: {
            ...state.layout,
            messagesLoaded: true,
          },
          messages: {
            ...action.messages
          }
        };
        break;
      case '2FA_CHECK':
        result = {
          ...state,
          userSettings: {
            ...state.userSettings,
            twoFAEnabled: action.value,
          },
        };
        break;
      case 'UPDATE_QR_CODE':
        result = {
          ...state,
          layout: {
            ...state.layout,
            qrCodeUrl: action.qrCodeUrl,
          },
        };
        break;
      case 'WALLETS_LOADED':
        result = {
          ...state,
          layout: {
            ...state.layout,
            walletsLoaded: true,
          },
        };
        break;
      case 'SHARE_WALLET_KEYS':
        shareContent(JSON.stringify(action.keys));
        result = {
          ...state
        };
        break;
      case 'SET_WALLET_KEYS':
        result = {
          ...state,
          wallets: {
            ...state.wallets,
            [action.address]: {
              ...state.wallets[action.address],
              keys: action.keys,
            }
          }
        };
        break;
      case 'CREATE_WALLET':
        if (!(action.address in state.wallets)) state.wallets[action.address] = {};
        result = {
          ...state,
          wallets: {
            ...state.wallets,
          },
        };
        break;
      case 'UPDATE_WALLETS':
        result = {
          ...state,
          wallets: {
            ...state.wallets,
            ...action.wallets,
          },
        };
        break;
      case 'SWITCH_WALLET':
        result = {
          ...state
        };
        break;
      case 'DELETE_WALLET':
        const { address } = action;
        delete state.wallets[address];
        result = {
          ...state,
          wallets: {
            ...state.wallets,
          },
        };
        break;
      case 'DELETE_WALLETS':
        result = {
          ...state,
          wallets: {},
        };
        break;
      case 'SET_DEFAULT_WALLET':
        result = {
          ...state,
          wallets: {
            ...state.wallets,
            ...action.wallets,
          },
        };
        break;
      case 'SEND_TX':
        result = {
          ...state,
          layout: {
            ...state.layout,
            sendTxResponse: action.sendTxResponse,
          },
        };
        break;
      case 'UPDATE_BLOCKCHAIN_HEIGHT':
        result = {
          ...state,
          network: {
            ...state.network,
            blockchainHeight: action.blockchainHeight,
          },
        };
        break;
      case 'UPDATE_MARKET':
        const { market, marketData } = action;
        const data = marketData.result !== 'error'
          ? { ...state.markets[market], ...marketData }
          : { ...state.markets[market] };
        if (market === 'stex') marketData.volume = marketData.vol_market || 0;
        result = {
          ...state,
          markets: {
            ...state.markets,
            [market]: {
              ...data,
            },
          },
        };
        break;
      case 'UPDATE_PRICES':
        const { pricesData } = action;
        result = {
          ...state,
          prices: {
            ...state.prices,
            ...pricesData.conceal
          },
        };
        break;
      case 'UPDATE_MARKET_DATA':
        result = {
          ...state,
          marketData: {
            ...state.marketData,
            ...action.marketData,
          },
        };
        break;
      case 'FORM_SUBMITTED':
        result = {
          ...state,
          layout: {
            ...state.layout,
            formSubmitted: action.value,
          },
        };
        if (action.value) result.layout.message = {};
        break;
      case 'REDIRECT_TO_REFERRER':
        result = {
          ...state,
          layout: {
            ...state.layout,
            redirectToReferrer: action.value,
          },
        };
        break;
      case 'PAYMENT_SENT':
        result = {
          ...state
        };
        break;
      case 'MESSAGE_SENT':
        result = {
          ...state
        };
        break;
      case 'APP_UPDATED':
        result = {
          ...state,
          layout: {
            ...state.layout,
            lastUpdate: new Date(),
          }
        };
        break;
      case 'SET_INTERVALS':
        const intervals = action.intervals.map(i => setInterval(i.fn, i.time * 1000));
        result = {
          ...state,
          intervals,
        };
        break;
      case 'SET_APP_DATA':
        result = {
          ...state,
          appData: mergeJSON.merge(state.appData, action.appData)
        };
        break;
      case 'BARCODE_SCANNED':
        result = {
          ...state
        }
        break
      case 'CLEAR_APP':
        logger.log('***** APP CLEANUP *****');
        state.intervals.forEach(interval => clearInterval(interval));
        result = {
          ...state,
          intervals: [],
          layout: {
            ...state.layout,
            appLoaded: false,
            userLoaded: false,
            walletsLoaded: false,
            loginFinished: false,
            messagesLoaded: false,
          },
          user: {
            ...state.user,
            loggedIn: false,
            token: null,
          },
          wallets: {},
        };
        break;
      default:
        throw new Error();
    }

    updatedState.current = result;
    return result;
  };

  return [...useReducer(reducer, initialState), updatedState];
};

export default useAppState;
