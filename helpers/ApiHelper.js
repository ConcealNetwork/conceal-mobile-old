export default class ApiHelper {
  constructor(options) {
    this.apiURL = options.state.appSettings.apiURL;
    this.auth = options.Auth;
    this.token = null;
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

  addContact = (label, address, paymentID, entryID = null, edit = false) => {
    const options = {
      method: edit ? 'PATCH' : 'POST',
      body: JSON.stringify({
        entryID,
        label,
        address,
        paymentID,
      })
    };
    return this.fetch(`${this.apiURL}/address-book`, options)
      .then(res => Promise.resolve(res));
  };

  deleteContact = entryID => {
    return this.fetch(`${this.apiURL}/address-book/delete/entryID/${entryID}`, { method: 'DELETE' })
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

  getWallets = () => {
    return this.fetch(`${this.apiURL}/wallet/unified`, { method: 'GET' })
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

  setDefaultWallet = address => {
    const body = {
      address: address
    };
    return this.fetch(`${this.apiURL}/wallet/default?address=${address}`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => Promise.resolve(res));
  }

  getPrices = pricesURL => {
    return fetch(`${pricesURL}/simple/price?ids=conceal&vs_currencies=btc,usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`)
      .then(r => r.json())
      .then(res => Promise.resolve(res));
  };

  getMarketPrices = marketApiURL => {
    return fetch(marketApiURL)
      .then(r => r.json())
      .then(res => Promise.resolve(res));
  };

  fetch = (url, options) => {
    let auth = this.auth;
    const headers = options.headers || {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // always set the installationId
    headers.uuid = Expo.Constants.installationId;

    const f = (url, { headers, ...options }) =>
      fetch(url, { headers, ...options })
        .then(this._checkStatus)
        .then(response => response.json());

    return new Promise(function (resolve, reject) {
      if (auth.loggedIn()) {
        headers.token = auth.getToken();
      }

      // return the function with headers
      resolve(f(url, { headers, ...options }));
    });
  };

  getMessages = () => {
    return this.fetch(`${this.apiURL}/wallet/messages`, { method: 'GET' })
      .then(res => Promise.resolve(res));
  };

  sendMessage = (message, address, wallet, twoFACode, password) => {
    const body = {
      message: message,
      address: address,
      wallet: wallet,
      sdm: 0
    };
    if (twoFACode && twoFACode !== '') body.code = twoFACode;
    if (password && password !== '') body.password = password;
    return this.fetch(`${this.apiURL}/wallet/send-message`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => Promise.resolve(res));
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
