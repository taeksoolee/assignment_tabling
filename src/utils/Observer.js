export default class Observer {
  constructor() {
    this._currIdx = 0;
    this.cbs = [];
    this.data = null;
  }

  subscribe(cb) {
    const idx = this._currIdx;
    this.cbs[idx] = cb;
    this._currIdx++;
    if(this.data) {
      cb && cb(this.data);
    }
    return idx;    
  }

  unsubscribe(idx) {
    delete this.cbs[idx];
  }

  next(data) {
    if(data === this.data) return;

    this.data = data;
    this.cbs.forEach((cb) => {
      cb && cb(data);
    })
  }
}

export const selectedReservation$ = new Observer();
export const openedModal$ = new Observer();