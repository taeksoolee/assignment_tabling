import PageBackground from './components/PageBackground.js';
import ReservationList from './components/ReservationList.js';
import ReservationDetail from './components/ReservationDetail.js';
import PageTitle from './components/PageTitle.js';

window.onload = function() {
  const $root = document.getElementById('root');

  const $pageBackground = new PageBackground();
  $root.appendChild($pageBackground);

  const $pageTitle = new PageTitle();
  $pageTitle.setAttribute('title', '예약 목록');
  $pageBackground.appendChild($pageTitle);

  const $pageSection = document.createElement('section');
  $pageBackground.appendChild($pageSection);

  const $reservationList = new ReservationList();
  $reservationList.setAttribute('store-id', 9533);
  $pageSection.appendChild($reservationList);

  const $reservationDetail = new ReservationDetail();
  $pageSection.appendChild($reservationDetail);
  $reservationDetail.createModalOverlay($root);
}
