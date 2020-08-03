import localStorage from '../helpers/LocalStorage';

class GuideNavigation {
  constructor(id, states, onStateChange) {
    this.onStateChange = onStateChange
    this.states = states;
    this.index = -1;
    this.id = id;
  }

  start = () => {
    if (localStorage.get(`guide_${this.id}`, '0') === '0') {
      this.index = 0;
      if (this.onStateChange) {
        this.onStateChange(this.states[this.index]);
      }
      localStorage.set(`guide_${this.id}`, '1');
      return this.states[this.index];
    } else {
      return null;
    }
  }

  next = () => {
    if (this.index < (this.states.length - 1)) {
      this.index++;
      if (this.onStateChange) {
        this.onStateChange(this.states[this.index]);
      }
      return this.states[this.index];
    } else {
      return null;
    }
  }

  reset = () => {
    this.index = -1;
    localStorage.set(`guide_${this.id}`, '0');
  }

  getCurrent = () => {
    return this.states[this.index];
  }
}

export default GuideNavigation;
