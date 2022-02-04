export default class Store {
  static _get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => (res.json()))
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getReservations(storeId) {
    return Store._get('https://frontend.tabling.co.kr/v1/store/'+storeId+'/reservations');
  }
}