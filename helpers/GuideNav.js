import localStorage from '../helpers/LocalStorage';

class GuideNavigation {
  constructor(id, states) {
    this.states = states;
    this.index = -1;
    this.id = id;
  }

  start = () => {
    if (localStorage.get(`guide_${this.id}`, '0') === '0') {
      this.index = 0;
      return this.states[this.index];
    } else {
      return null;
    }
  }

  next = () => {
    if (this.index < (this.states.length - 1)) {
      this.index++;
      if (this.index === (this.states.length - 1)) {
        localStorage.set(`guide_${this.id}`, '1');
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
