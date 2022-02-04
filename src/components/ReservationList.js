import ReservationItem from './ReservationItem.js';
import { selectedReservation$ } from '../utils/Observer.js';
import Store from '../utils/Store.js';

const props = {
  storeId: 'store-id'
}

export default class ReservationList extends HTMLElement {
  constructor() {
    super();
    this.$$reservationItems = [];
  }

  static get observedAttributes() {
    return Object.values(props);
  }

  connectedCallback() {
    this.render();
  }

  adoptCallback() { }

  async attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case props.storeId:
        const storeId = newVal;

        const data = await Store.getReservations(storeId);
        const { reservations } = data;
        this.reservations = reservations
                              .filter((reservation) => (reservation.status !== 'done')); 
        selectedReservation$.next(reservations[0]);
        this.render();
        break;
    }
  }

  get storeId() {
    return this.getAttribute(props.storeId);
  }

  render() {
    Array.from(this.children).forEach((child) => this.removeChild(child));
    
    if(!(this.reservations && this.reservations.length > 0)) {
      const $container = document.createElement('div');
      $container.innerText = '데이터가 존재하지 않습니다.';
      this.appendChild($container);
      return;
    }

    this.$$reservationItems = this.reservations.map((reservation) => {
      const $reservationItem = new ReservationItem();
      $reservationItem.setReservation(reservation);
      $reservationItem.addEventListener('remove', this._handleRemove.bind(this));
      $reservationItem.addEventListener('change', this._handleChange.bind(this));
      this.appendChild($reservationItem);

      return $reservationItem;
    });
  }

  _handleChange(e) {
    const $reservationItem = e.target;
    selectedReservation$.next($reservationItem.reservation);
  }

  _handleRemove(e) {
    const $reservationItem = e.target;
    
    const _reservations = this.reservations
                            .filter(({id}) => (id !== $reservationItem.reservation.id))
                            .filter((reservation) => (reservation.status !== 'done'));
    this.reservations = _reservations;
    
    if(selectedReservation$.data.id === $reservationItem.reservation.id) {
      selectedReservation$.next(_reservations[0]);
    }

    this.render();
  }
}

window.customElements.define('reservation-list', ReservationList);