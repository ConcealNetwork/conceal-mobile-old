export default class Api {
  constructor(options) {
    this.apiURL = 'https://api.wallet.conceal.network/api';
    this.auth = options.auth;
  }

  signUpUser = (userName, email, password) => {
    const body = {
      email,
      name: userName,
      password,
    };
    return this.fetch(`${this.apiURL}/user`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => Promise.resolve(res));
  };

  resetPassword = email => {
    const body = JSON.stringify({ email });
    return this.fetch(`${this.apiURL}/auth/`, { method: 'PUT', body })
      .then(res => Promise.resolve(res));
  };

  resetPasswordConfirm = (password, Token) => {
    const headers = { Token };
    const body = JSON.stringify({ password });
    return this.fetch(`${this.apiURL}/auth/`, { method: 'PATCH', headers, body })
      .then(res => Promise.resolve(res));
  };

  updateUser = ({ email, file }) => {
    const body = {};
    if (email) body.email = email;

    const options = {
      method: file ? 'POST' : 'PATCH',
      body: file || JSON.stringify(body),
    };
    if (file) options.headers = {};

    return this.fetch(`${this.apiURL}/user/${file ? 'avatar' : ''}`, options)
      .then(res => Promise.resolve(res));
  };

  getUser = () => {
    return this.fetch(`${this.apiURL}/user`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  getBlockchainHeight = () => {
    return this.fetch(`${this.apiURL}/status/height`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  check2FA = () => {
    return this.fetch(`${this.apiURL}/two-factor-authentication/enabled/`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  update2FA = (code, enable) => {
    const options = { method: enable ? 'PUT' : 'DELETE' };
    if (enable) options.body = JSON.stringify({ code });
    return this.fetch(`${this.apiURL}/two-factor-authentication${enable ? '' : `?code=${code}`}`, options)
      .then(res => Promise.resolve(res));
  };

  getQRCode = () => {
    return this.fetch(`${this.apiURL}/two-factor-authentication/`, { method: 'POST' })
      .then(res => Promise.resolve(res));
  };

  getWalletList = () => {
    console.log(this.auth);

    return this.fetch(`${this.apiURL}/wallet/list`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  getWalletDetails = address => {
    return this.fetch(`${this.apiURL}/wallet/get/address/${address}`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  createWallet = () => {
    return this.fetch(`${this.apiURL}/wallet/`, { method: 'POST' })
      .then(res => Promise.resolve(res));
  };

  getWalletKeys = (address, code) => {
    return this.fetch(`${this.apiURL}/wallet/keys?address=${address}&code=${code}`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  sendTx = (wallet, address, paymentID, amount, message, twoFACode, password) => {
    const body = {
      address,  // destination
      amount: parseFloat(amount),
      message,
      paymentID,
      wallet,  // origin
    };
    if (twoFACode && twoFACode !== '') body.code = twoFACode;
    if (password && password !== '') body.password = password;
    return this.fetch(`${this.apiURL}/wallet`, { method: 'PUT', body: JSON.stringify(body) })
      .then(res => Promise.resolve(res));
  };

  deleteWallet = address => {
    return this.fetch(`${this.apiURL}/wallet?address=${address}`, { method: 'DELETE' })
      .then(res => Promise.resolve(res));
  };

  getPrices = pricesURL => {
    return fetch(`${pricesURL}/simple/price?ids=conceal&vs_currencies=btc&include_last_updated_at=true`)
      .then(r => r.json())
      .then(res => Promise.resolve(res));
  };

  getMarketPrices = marketApiURL => {
    return fetch(marketApiURL)
      .then(r => r.json())
      .then(res => Promise.resolve(res));
  };

  fetch = (url, options) => {
    const headers = options.headers || {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.auth.loggedIn()) {
      headers.token = this.auth.getToken();
    } 

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
