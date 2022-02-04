import Converter from "../utils/Converter.js";
import { openedModal$, selectedReservation$ } from "../utils/Observer.js";

const props = {
  
}

export default class ReservationDetail extends HTMLElement {
  constructor() {
    super();

    this.$reservationTitle = document.createElement('h3');
    this.$reservationTitle.innerText = '예약 정보';

    this.$customerTitle = document.createElement('h3');
    this.$customerTitle.innerText = '고객 정보'


    this.$closeBtn = document.createElement('button');
    this.$closeBtn.innerText = '닫기';
    this.$closeBtn.classList.add('modal-close-btn');

    this.$closeBtn.addEventListener('click', this._closeModal.bind(this));

    this.selectedId = -1;
    this.openedId = -1;

    this.$modalOverlay = null;
    
  }

  static get observedAttributes() {
    return Object.values(props);
  }

  connectedCallback() {
    this.selectedId = selectedReservation$.subscribe(this.setReservation.bind(this));
    this.openedId = openedModal$.subscribe(this._toggleModal.bind(this));

    this.render();
  }

  adoptCallback() { }

  disconnectedCallback() {
    selectedReservation$.unsubscribe(this.selectedId);
    openedModal$.unsubscribe(this.openedId);
  }

  async attributeChangedCallback(attrName, oldVal, newVal) {
    this.render();
  }
  
  setReservation(reservation) {
    this.reservation = reservation;
    this.render();
  }

  createModalOverlay(parentElement) {
    const $modalOverlay = document.createElement('div');
    $modalOverlay.addEventListener('click', this._closeModal.bind(this));
    $modalOverlay.classList.add('modal-overlay')
    parentElement.parentElement.appendChild($modalOverlay);

    this.$modalOverlay = $modalOverlay;
  }

  render() {
    Array.from(this.children).forEach((child) => (this.removeChild(child)));
    
    if(!this.reservation) {
      const $container = document.createElement('div');
      $container.innerText = '정보 없음';
      this.appendChild($container);
      return;
    }

    const {
      // id, 
      status, timeRegistered, timeReserved, 
      customer, 
      // tables, menus,
    } = this.reservation;

    this.appendChild(this.$closeBtn);

    this.appendChild(this.$reservationTitle);
    this.appendChild(this._createRowElement('예약 상태', Converter.statusText(status)));
    this.appendChild(this._createRowElement('예약 시간', Converter.timeText(timeRegistered)));
    this.appendChild(this._createRowElement('접수 시간', Converter.timeText(timeReserved)));
   
    this.appendChild(this.$customerTitle);
    this.appendChild(this._createRowElement('고객 성명', customer.name));
    this.appendChild(this._createRowElement('고객 등급', customer.level));
    this.appendChild(this._createRowElement('고객 메모', customer.memo));

    const $request = this._createRowElement('요청 사항', customer.request);
    $request.classList.add('mt-xl');
    this.appendChild($request);
  }

  _createRowElement(label, value) {
    const $container = document.createElement('div');

    const $label = document.createElement('label');
    $label.innerText = label;
    $container.appendChild($label);

    const $value = document.createElement('div');
    $value.innerText = value;
    $container.appendChild($value);

    return $container;
  }

  _toggleModal(opened) {
    if(opened) {
      this.classList.add('open');
      this.$modalOverlay.classList.add('open');
    } else {
      this.classList.remove('open');
      this.$modalOverlay.classList.remove('open');
    }
  }

  _closeModal() {
    openedModal$.next(false);
  }
}

window.customElements.define('reservation-detail', ReservationDetail);
