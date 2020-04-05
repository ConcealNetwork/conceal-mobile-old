import * as SecureStore from 'expo-secure-store';

class LocalStorage {
  constructor() {
    this.memStorage = {};
    this._initialize(this.memStorage);
  }

  _initialize = (storage) => {
    SecureStore.getItemAsync('Conceal.allKeys').then((keys) => {
      if (keys) {
        let allKeys = keys.split(',');

        allKeys.forEach(function (key, index, array) {
          SecureStore.getItemAsync(key).then((value) => {
            if (value) {
              storage[key] = value;
            }
          }).catch((err) => {
            console.log(err);
          });
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  _storeAllKeys = (storage) => {
    let allKeys = [];

    Object.keys(storage).forEach(function (key) {
      allKeys.push(key);
    });

    SecureStore.setItemAsync('Conceal.allKeys', allKeys.join()).then((result) => {
      // do nothing
    }).catch((err) => {
      console.log(err);
    });
  }

  get = (name, defValue) => {
    let value = this.memStorage[`Conceal.${name}`];

    if (!value && defValue) {
      value = defValue;
    }

    return value;
  };

  set = (name, value) => {
    let fullName = `Conceal.${name}`;
    this.memStorage[fullName] = value;
    SecureStore.setItemAsync(fullName, value).then((result) => {
      // do nothing
    }).catch((err) => {
      console.log(err);
    });

    // store all keys to the storage
    this._storeAllKeys(this.memStorage);
  };

  remove = (name) => {
    let fullName = `Conceal.${name}`;
    delete this.memStorage[fullName];
    SecureStore.deleteItemAsync(fullName).then((result) => {
      // do nothing
    }).catch((err) => {
      console.log(err);
    });

    // store all keys to the storage
    this._storeAllKeys(this.memStorage);
  };
}

const localStorage = new LocalStorage();
export default localStorage;
