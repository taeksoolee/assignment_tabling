import { openedModal$, selectedReservation$ } from '../utils/Observer.js';
import Converter from '../utils/Converter.js';

const props = {
  
}

export default class ReservationItem extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return Object.values(props);
  }

  connectedCallback() {
    this.addEventListener('click', this._handleClick.bind(this), false);
    this.render();
  }

  disconnectedCallback() {
    this.addEventListener('click', this._handleClick.bind(this), false);
  }

  adoptCallback() { }

  async attributeChangedCallback(attrName, oldVal, newVal) {
    this.render();
  }
  
  setReservation(reservation) {
    this.reservation = reservation;
    this.render();
  }

  

  render() {
    Array.from(this.children).forEach((child) => this.removeChild(child));

    if(!this.reservation) {
      return;
    }

    const {
      id, status, timeRegistered, timeReserved, 
      customer: {
        name: customerName,
        adult: customerAdult, 
        child: customerChild,
      }, 
      tables, menus,
    } = this.reservation;

    // leftWrapper
    {
      const $wrapper = document.createElement('div');
      this.appendChild($wrapper);

      const $item1 = document.createElement('div');
      $item1.innerText = Converter.timeText(timeRegistered);
      $wrapper.appendChild($item1);
      
      const $item2 = document.createElement('div');
      $item2.innerText = Converter.statusText(status);
      $item2.classList.add(status === 'reserved' ? 'reserved-text' : 'stated-text');
      $wrapper.appendChild($item2);
    }

    // centerWrapper
    {
      const $wrapper = document.createElement('div');
      this.appendChild($wrapper);

      const $item1 = document.createElement('div');
      $item1.innerText = customerName + ' - ' + tables.map((table) => (table.name)).join(', ');
      $wrapper.appendChild($item1);

      const $item2 = document.createElement('div');
      $item2.innerText = ' 성인 ' + Converter.numberText(customerAdult) + ' 아이 ' + Converter.numberText(customerChild);
      $wrapper.appendChild($item2);

      const $item3 = document.createElement('div');
      $item3.innerText = menus?.map(({name, qty}) => (name + '(' + qty + ')')).join(', ');
      $wrapper.appendChild($item3);
    }

    // rightWrapper
    {
      const $wrapper = document.createElement('div');
      this.appendChild($wrapper);

      const $item1 = document.createElement('div');
      $wrapper.appendChild($item1);

      const $button = document.createElement('button');
      $button.innerText = Converter.statusButtonText(status);
      
      $button.addEventListener('click', this._handleClickButton.bind(this));
      $button.classList.add('primary-btn');
      $item1.appendChild($button);
    }
  }

  _handleClick(e) {
    selectedReservation$.next(this.reservation);
    if(parseInt(window.innerWidth) < 1024) {
      openedModal$.next(!openedModal$.data);
    }
  }

  _handleClickButton(e) {
    e.stopPropagation();
    const _reservation = Object.assign({}, this.reservation);
    _reservation.status = _reservation.status === 'reserved' ? 'seated' : 'done';
    this.setReservation(_reservation);

    if(_reservation.status === 'done') {
      this.dispatchEvent(new CustomEvent('remove', _reservation));
    } else {
      this.dispatchEvent(new CustomEvent('change', _reservation));
    }
  }
}

window.customElements.define('reservation-item', ReservationItem);

