import localStorage from './LocalStorage';
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

    if (!twoFACode && this.getIsAltAuth()) {
      body.checksum = this.getChecksum();
    }

    if (twoFACode && twoFACode !== '') body.code = twoFACode;
    return this.fetch(`${this.domain}/auth`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => {
        if (res.message.checksum) this.setChecksum(res.message.checksum);
        if (res.message.token) this.setToken(res.message.token);
        return Promise.resolve(res);
      });
  };

  loggedIn = () => {
    let token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  };

  setUsername = idUsername => localStorage.set('id_username', idUsername);
  getUsername = () => { return localStorage.get('id_username') };
  getIsAltAuth = () => { return (localStorage.get('auth_method', 'password') !== "password") };
  setRememberme = idRememberme => localStorage.set('id_rememberme', idRememberme);
  getRememberme = () => { return localStorage.get('id_rememberme') == "TRUE"; }
  setChecksum = checksum => localStorage.set('id_checksum', checksum);
  getChecksum = () => { return localStorage.get('id_checksum') }
  setToken = idToken => localStorage.set('id_token', idToken);
  getToken = () => { return localStorage.get('id_token'); }
  logout = () => localStorage.remove('id_token');
  decodeToken = () => (decode(this.getToken()));

  fetch = (url, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

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
