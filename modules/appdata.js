import { observable, action } from 'mobx';
import AuthHelper from '../src/helpers/AuthHelper.js';
import Api from '../src/helpers/Api.js';

class dataUser {
  @observable addressBook = [];

  constructor(Auth, Api) {
    this.Auth = Auth;
    this.Api = Api;
  }

  fetchUserData(callback) {
    this.Api.getUser().then(res => {
      if ((res.result) && (res.result == "success")) {
        if ((res.message) && (res.message.addressBook)) {
          this.addressBook = res.message.addressBook;
          callback(true);
        }
      } else {
        callback(false);
      }
    }).catch(err => {
      callback(false);
    });
  };

  getAddressBook() {
    return this.addressBook;
  }
}

class dataWallets {
  @observable wallets = {};

  constructor(Auth, Api) {
    this.Auth = Auth;
    this.Api = Api;
  }

  @action setWallet(address, details) {
    details.address = address;
    this.wallets[address] = details;
  }

  @action removeWallet(address) {
    this.wallets[address] = {};
  }

  fetchWallets(callback) {
    var walletCount = 0;
    var counter = 0;

    this.Api.getWalletList().then(res => {
      walletCount = res.message.addresses.length;
      res.message.addresses && res.message.addresses.forEach(address => {
        this.Api.getWalletDetails(address).then(res => {
          counter++;

          if (res.result === 'success') {
            this.setWallet(address, res.message);
          }

          if (counter == walletCount) {
            callback(true);
          }
        }).catch(e => {
          callback(false);
        });
      });
    }).catch(err => {
      callback(false);
    });
  }

  getWallets() {
    var walletsArray = [];
    for (var propertyName in this.wallets) {
      walletsArray.push(this.wallets[propertyName]);
    }
    return walletsArray;
  }

  getDefaultWallet() {
    var wallets = this.getWallets();

    if (wallets.length > 0) {
      return wallets[0];
    } else {
      return null;
    }
  }
}

class appData {
  constructor() {
    this.Auth = new AuthHelper();
    this.Api = new Api({ auth: this.Auth });

    this.dataUser = new dataUser(this.Auth, this.Api);
    this.dataWallets = new dataWallets(this.Auth, this.Api);
  }

  login(username, password, token, callback) {
    this.Auth.login(username, password).then(res => {
      if (res.result === 'success') {
        callback(true);
      } else {
        callback(false);
      }
    })
      .catch(err => {
        callback(false);
      })
      .finally(() => {

      });
  }
}

export default new appData();