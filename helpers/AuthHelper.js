import { AsyncStorage } from 'react-native';
import decode from 'jwt-decode';


export default class AuthHelper {
  constructor(domain) {
    this.domain = domain;
  }

  login = options => {
    const { email, password, twoFACode, uuid } = options;
    const body = {
      uuid,
      email,
      password,
      rememberme: true,
    };
    if (twoFACode && twoFACode !== '') body.code = twoFACode;
    return this.fetch(`${this.domain}/auth`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => {
        if (res.message.token) this.setToken(res.message.token);
        return Promise.resolve(res);
      });
  };

  loggedIn = () => {
    return this.getToken()
      .then(token => !!token && !this.isTokenExpired(token))
      .catch(e => console.error(e));
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  };

  setUsername = async idUsername => await AsyncStorage.setItem('@conceal:id_username', idUsername);
  getUsername = async () => (await AsyncStorage.getItem('@conceal:id_username'));
  setRememberme = async idRememberme => await AsyncStorage.setItem('@conceal:id_rememberme', idRememberme);
  getRememberme = async () => (await AsyncStorage.getItem('@conceal:id_rememberme'));
  setToken = async idToken => await AsyncStorage.setItem('@conceal:id_token', idToken);
  getToken = async () => (await AsyncStorage.getItem('@conceal:id_token'));
  logout = async () => await AsyncStorage.removeItem('@conceal:id_token');
  decodeToken = () => (decode(this.getToken()));

  fetch = (url, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    // if (this.loggedIn()) headers.Authorization = `Bearer ${this.getToken()}`;

    return fetch(url, { headers, ...options })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  _checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
