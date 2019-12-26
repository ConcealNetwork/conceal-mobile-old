import { AsyncStorage } from 'react-native';

class LocalStorage {
  constructor() {
    this.memStorage = {};
    this._initialize(this.memStorage);
  }

  _initialize = (storage) => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, values) => {
        values.map((result, i, values) => {
          storage[values[i][0]] = values[i][1];
          return true;
        });
      });
    });
  }

  localGet = (name) => {
    return this.memStorage[`@conceal:${name}`];
  };

  localSet = (name, value) => {
    let fullName = `@conceal:${name}`;
    this.memStorage[fullName] = value;
    this.syncStorage.set(fullName, value);
  };

  localRemove = (name) => {
    let fullName = `@conceal:${name}`;
    delete this.memStorage[fullName];
    this.syncStorage.remove(fullName);
  };
}

const localStorage = new LocalStorage();
export default localStorage;
